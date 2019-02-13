// Setup basic express server
var debug = true;

var port = debug ? 7777 : 27016;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var players = [];
var matches = [];

server.listen(7777, function () {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname + '/public'));

var cards = [
  {
    name: "Stoat",
    attack: 1,
    health: 3,
    starve: 1,
    symbol: "none"
  },
  {
    name: "Squirrel",
    attack: 0,
    health: 1,
    starve: 0,
    symbol: "none"
  },
  {
    name: "Cat",
    attack: 0,
    health: 3,
    starve: 1,
    symbol: "sacrifice"
  },
  {
    name: "Wolf",
    attack: 3,
    health: 3,
    starve: 2,
    symbol: "none"
  },
  {
    name: "Grizzly",
    attack: 4,
    health: 5,
    starve: 3,
    symbol: "none"
  },
];

var defaultDeck = [];
for(var i = 0; i < 30; i++) {
  if(i < 12) {
    defaultDeck.push(cards[1]);
  }
  else if(i < 15) {
    defaultDeck.push(cards[2]);
  }
  else if(i < 22) {
    defaultDeck.push(cards[0]);
  }
  else if(i < 27) {
    defaultDeck.push(cards[3]);
  }
  else {
    defaultDeck.push(cards[5]);
  }
}


io.on('connection', function (socket) {
  
console.log('User Connected');
  // when the client emits 'add user', this listens and executes
  
  socket.on('Starting', function (name) {
    var player = newPlayer(socket.id, name);
    players.push(player);
    socket.emit("You'reIn",player);
    socket.emit("Waiting",true);
  });

  socket.on('SendControls', function (data) {
    for(var i in players) {
      if(players[i].id == socket.id) {
        players[i].move = data;
      }
    }
  });

  socket.on('Color', function (data) {
    var player = getPlayerByID(socket.id);
    if(player) {
      player.color = data;
    }

  });

  socket.on('CreateOrder', function (data) {
    var drugAmount = Math.floor(data.drugAmount);

    var payout = priceFromDrug(data.drugType).cost;
    var risk = priceFromDrug(data.drugType).risk;

    payout *= drugAmount;
    risk *= drugAmount;

    payout *= multiplierFromCountry(data.drugPlace).cost;
    risk *= multiplierFromCountry(data.drugPlace).risk;

    var runnerPayout = Math.floor((payout/100)*.75) *100 ;
    var orderPayout =Math.floor((payout/100)*.25) *100;

    var order = {
      runnerPayout: runnerPayout,
      orderPayout: orderPayout,
      risk: risk.toFixed(2),
      ordererId: socket.id
    };

    orders.push(order);
    sendOut("drugs");

  });


  socket.on('disconnect', function () {
    for(var i = 0; i < players.length;i++) {
      if(players[i].id == socket.id) {
        players.splice(i,1);
      }
    }
  });
});



function newMatch (player1, player2) {
  return {
    fighters: [getFighter(player1),getFighter(player2)],
    battlefield: [[null,null,null,null],[null,null,null,null]],
    turn: 0,
    whoseTurn: 1,
    otherTurn: 0,
    turnCounter: 0,

    startMatch: function () {
      //let our players know they are in a match
      sendByID(this.fighters[0].id,"Match",true);
      sendByID(this.fighters[1].id,"Match",true);

      //shuffle decks
      shuffle(this.fighters[0].deck);
      shuffle(this.fighters[1].deck);

      //draw opening hands
      this.drawCard(0);
      this.drawCard(0);
      this.drawCard(0);
      this.drawCard(1);
      this.drawCard(1);
      this.drawCard(1);


      this.updatePlayers();
      this.startTurn();
    },

    startTurn: function () {
      //flip the turn
      this.flipTurn();

      //draw a card
      this.drawCard(this.whoseTurn);

      //update everyone
      this.updatePlayers();
    },

    endTurn: function () {
      var currentBattlefield = this.battlefield[this.whoseTurn];
      var enemyBattlefield = this.battlefield[this.otherTurn];

      for(var i = 0; i < 4; i++) {
        var currentBeast = currentBattlefield[i];

        //do we even have a beast here?
        if(currentBeast == null) {
          continue;
        }

        //lets grab our enemy
        var currentEnemyBeast = enemyBattlefield[i];

        if(currentEnemyBeast == null) {
          //opposing enemy is null, so hit face, changing the dev
          this.fighters[this.whoseTurn].dev += currentBeast.attack;
          this.fighters[this.otherTurn].dev -= currentBeast.attack;
        }
        else if(currentEnemyBeast != null) {
          //opposing enemy is there, so hit it. Kill it if it loses all it's health
          currentEnemyBeast.health -= currentBeast.attack;

          //is the beast dead?
          if(currentEnemyBeast.health <= 0) {
            //lets kill it
            this.kill(this.otherTurn,i);
          }
        }
      }

      //done, update then next turn
      this.updatePlayers();
      this.startTurn();
    },

    updatePlayers: function () {
      io.sockets.connected[this.fighters[0].id].emit("MatchUpdate",this.fighters[0],this.fighters[1].hand.length,this.battlefield[0],this.battlefield[1],this.whoseTurn == 0,this.turnCounter);
    },

    kill: function (battlefieldIndex, beastIndex) {
      //kill a beast
      this.battlefield[battlefieldIndex][beastIndex] = null;
    },

    flipTurn: function () {
      this.whoseTurn = this.whoseTurn == 0 ? 1 : 0;
      this.otherTurn = this.whoseTurn == 0 ? 1 : 0;
      this.turnCounter = Date.now();
    },

    drawCard: function(fighterNum) {
      this.fighters[fighterNum].hand.push( this.fighters[fighterNum].deck[0]);
      this.fighters[fighterNum].deck.splice(0,1);
    }
  };
}

function getFighter(player) {
  return {
    name: player.name,
    id: player.id,
    deck: player.deck,
    hand: [],
    dev: 0,
  };
}

function getBeast(card) {

  var beast =  {
    name: card.name,
    attack: card.attack,
    health: card.health,
    maxHealth: card.health,
    symbol: card.symbol
  };

  //give card properties here
  
  return beast;
}

function newPlayer (id, name) {
  return {
    id: id,
    name: name,
    type: "player",
    deck: defaultDeck,
    wins: 0,
    losses: 0,
    inMatch: false,
  };
}

function sendByID(id, name,  data) {
  io.sockets.connected[id].emit(name,data);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hasWhiteSpace(str) {
  return str.indexOf(' ') >= 0;
}

function getPlayerByCID(cid) {
  for(var i in players) {
    if(players[i].cid == cid)
      return players[i];
  }
}

function getPlayerByID(id) {
  for(var i in players) {
    if(players[i].id == id)
      return players[i];
  }
}

function genKey() {
  var key = "";
  for(var o = 0 ; o< 40; o++) {
    key += String(getRandomInt(0,9));
    
  }
  return key;
}

function matchMake() {
  var first = null;

  for(var i = 0; i < players.length; i++) {
    if(!players[i].inMatch && first == null) {
      first = players[i];
    }
    else if(!players[i].inMatch && first !== null && second == null) {
      players[i].inMatch = true;
      first.inMatch = true;
      matches.push(newMatch(first, players[i]));


      return;
    }
  }
}

setInterval(matchMake,1000);

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}
