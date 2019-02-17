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


io.on('connection', function (socket) {
  
console.log('User Connected');
  // when the client emits 'add user', this listens and executes
  
  socket.on('Starting', function (name) {
    var player = newPlayer(socket.id, name);
    players.push(player);
    socket.emit("You'reIn",player);
    socket.emit("Waiting",true);
  });

  socket.on('EndTurn', function (data) {
    var match = getMatchByID(socket.id);

    if(match.fighters[match.whoseTurn].id == socket.id ) {
      match.endTurn();
    }
  });
  
  socket.on('PlaceCard', function (card, endLoc, sacrificeIndexs) {
    var match = getMatchByID(socket.id);

    if(match.fighters[match.whoseTurn].id == socket.id ) {
      match.placeCard(match.whoseTurn,card,sacrificeIndexs,endLoc);
    }
  });

  socket.on('SendControls', function (data) {
    for(var i in players) {
      if(players[i].id == socket.id) {
        players[i].move = data;
      }
    }
  });



  socket.on('disconnect', function () {
    for(var i = 0; i < players.length;i++) {
      if(players[i].id == socket.id) {
        players.splice(i,1);
      }
    }
  });
});

function getMatchByID(id) {
  for(var i = 0; i < matches.length; i++) {
    if(matches[i].fighters[0].id == id || matches[i].fighters[1].id == id) {
      return matches[i];
    }
  }
}

/*
  ANIMATE OBJECTS
  DRAWCARD:[animtype (string), myteam (bool), handindex (int)]
  STARTTURN:[animtype (string), myturn (bool)]
  ENDTURN:[animtype (string)]
  ATTACKBEAST:[animtype (string), mybeast (bool), battlefieldindex (int)]
  HITBEAST:[animtype (string), mybeast (bool), battlefieldindex (int), updatedbeast (object)]
  DIEBEAST:[animtype (string), mybeast (bool), battlefieldindex (int)]
  PLACECARD:[animtype (string), mybeast (bool), handindex (int), battlefieldindex (int)]
  DEV:[animtype (string), dev (int)]

*/ 

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

      //add animates
      this.fighters[this.whoseTurn].animate.push( ["startturn", true]);
      this.fighters[this.whoseTurn == 0 ? 1 : 0].animate.push( ["startturn", false]);

      //draw a card
      this.drawCard(this.whoseTurn);

      //update everyone
      this.updatePlayers();
    },

    endTurn: function () {
      var currentBattlefield = this.battlefield[this.whoseTurn];
      var enemyBattlefield = this.battlefield[this.otherTurn];
      
      this.fighters[this.whoseTurn].animate.push( ["endturn"]);
      this.fighters[this.whoseTurn == 0 ? 1 : 0].animate.push( ["endturn"]);

      for(var i = 0; i < 4; i++) {
        var currentBeast = currentBattlefield[i];

        //do we even have a beast here?
        if(currentBeast == null) {
          continue;
        }

        //if our beast attacks, lets do that
        if(currentBeast.attack > 0) {

          //animate it!
          this.fighters[this.whoseTurn].animate.push( ["attackbeast",true,i]);
          this.fighters[this.whoseTurn == 0 ? 1 : 0].animate.push( ["attackbeast",false,i]);

          //lets grab our enemy
          var currentEnemyBeast = enemyBattlefield[i];
        
          if(currentEnemyBeast == null) {
            //opposing enemy is null, so hit face, changing the dev
            this.fighters[this.whoseTurn].dev += currentBeast.attack;
            this.fighters[this.otherTurn].dev -= currentBeast.attack;

            console.log(this.fighters[this.whoseTurn].dev);

            this.fighters[this.whoseTurn].animate.push( ["dev",this.fighters[this.whoseTurn].dev ]);
            this.fighters[this.otherTurn].animate.push( ["dev",this.fighters[this.otherTurn].dev ]);
  
  
          }
          else if(currentEnemyBeast != null) {
            //opposing enemy is there, so hit it. Kill it if it loses all it's health
            currentEnemyBeast.health -= currentBeast.attack;
            
            this.fighters[this.whoseTurn].animate.push( ["hitbeast",false,i,Object.assign({}, currentEnemyBeast)]);
            this.fighters[this.whoseTurn == 0 ? 1 : 0].animate.push( ["hitbeast",true,i,Object.assign({}, currentEnemyBeast)]);
  
            //is the beast dead?
            if(currentEnemyBeast.health <= 0) {
              //lets kill it
              this.kill(this.otherTurn,i);
            }
          }
        }
      }

      //done, update then next turn
      this.updatePlayers();
      this.startTurn();
    },

    updatePlayers: function () {
      console.log("Sending out match data");
      //send out match data
      io.sockets.connected[this.fighters[0].id].emit("MatchUpdate",this.fighters[0],this.fighters[1].hand.length,this.battlefield[0],this.battlefield[1],this.whoseTurn == 0,this.turnCounter);
      io.sockets.connected[this.fighters[1].id].emit("MatchUpdate",this.fighters[1],this.fighters[0].hand.length,this.battlefield[1],this.battlefield[0],this.whoseTurn == 1,this.turnCounter);

      //clear animates
      this.fighters[0].animate = [];
      this.fighters[1].animate = [];
    },

    placeCard: function (playerIndex,handIndex, sacrificeIndexs, battlefieldIndex) {

      if(playerIndex == this.whoseTurn) {
        //lets get everything
        var currentFighter = this.fighters[playerIndex];
        var cardBeingPlayed = currentFighter.hand[handIndex];
        var currentBattlefield = this.battlefield[playerIndex];


        for (var o = 0; o < sacrificeIndexs.length; o++) {
          if(currentBattlefield[sacrificeIndexs[o]] == null) {
            //if they try to sacrifice some guy that isn't there GET OUT
            console.log("fighter not found" + sacrificeIndexs[o]);
            return;
          }

          if(currentBattlefield[sacrificeIndexs[o]].symbol == "sacrifice" && battlefieldIndex == sacrificeIndexs[o]) {
            console.log("tried to place on cat");
            return;
          }
        }

        if(cardBeingPlayed.starve == sacrificeIndexs.length) {
          //sacrifice the guys
          for (var o = 0; o < sacrificeIndexs.length; o++) {
            this.sacrifice(playerIndex,sacrificeIndexs[o]);
          }

          //play the card
          this.playCardFromHand(playerIndex,handIndex,battlefieldIndex);
        }
      }
      else {
        return;
      }
    },

    playCardFromHand: function (playerIndex,handIndex,battlefieldIndex) {
      //get the card
      var cardBeingPlayed = this.fighters[playerIndex].hand[handIndex];

      //animates
      this.fighters[0].animate.push( ["placecard",playerIndex == 0,handIndex,battlefieldIndex]);
      this.fighters[1].animate.push( ["placecard",playerIndex == 1,handIndex, battlefieldIndex]);

      //turn it into a beast onto the battlefield
      this.battlefield[playerIndex][battlefieldIndex] = getBeast(cardBeingPlayed);

      //remove it from the hand
      this.fighters[playerIndex].hand.splice(handIndex,1);

      //update our players
      this.updatePlayers();
    },
    
    kill: function (battlefieldIndex, beastIndex) {
      this.fighters[0].animate.push( ["diebeast",battlefieldIndex == 0,beastIndex]);
      this.fighters[1].animate.push( ["diebeast",battlefieldIndex == 1,beastIndex]);
      
      //kill a beast
      this.battlefield[battlefieldIndex][beastIndex] = null;
    },
    
    sacrifice: function (battlefieldIndex, beastIndex) {
      if(this.battlefield[battlefieldIndex][beastIndex].symbol != "sacrifice" ) {
        this.fighters[0].animate.push( ["diebeast",battlefieldIndex == 0,beastIndex]);
        this.fighters[1].animate.push( ["diebeast",battlefieldIndex == 1,beastIndex]);
  
        //sacrifice a beast
        this.battlefield[battlefieldIndex][beastIndex] = null;
      }
    },

    flipTurn: function () {
      this.whoseTurn = this.whoseTurn == 0 ? 1 : 0;
      this.otherTurn = this.whoseTurn == 0 ? 1 : 0;
      this.turnCounter = Date.now();
    },

    drawCard: function(fighterNum) {
      //put card in hand
      this.fighters[fighterNum].hand.push( this.fighters[fighterNum].deck[0]);

      //take out of deck
      this.fighters[fighterNum].deck.splice(0,1);

      //add animates
      this.fighters[fighterNum].animate.push( ["drawcard", true, this.fighters[fighterNum].hand.length - 1]);
      this.fighters[fighterNum == 0 ? 1 : 0].animate.push( ["drawcard", false, this.fighters[fighterNum].hand.length - 1]);
    }
  };
}

function getFighter(player) {
  return {
    name: player.name,
    id: player.id,
    deck: player.deck,
    animate: [],
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
    starve: card.starve,
    symbol: card.symbol
  };

  //give card properties here
  
  return beast;
}

function newPlayer (id, name) {
  console.log("Creating player " + name);
  var defaultDeck = [];

  for(var i = 0; i < 20; i++) {
    if(i < 8) {
      defaultDeck.push(Object.assign({}, cards[1]));
    }
    else if(i < 12) {
      defaultDeck.push(Object.assign({}, cards[2]));
    }
    else if(i < 16) {
      defaultDeck.push(Object.assign({}, cards[0]));
    }
    else if(i < 19) {
      defaultDeck.push(Object.assign({}, cards[3]));
    }
    else {
      defaultDeck.push(Object.assign({}, cards[4]));
    }
  }

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
    else if(!players[i].inMatch && first !== null ) {

      console.log("Making match " + first.name + " " + players[i].name);
      players[i].inMatch = true;
      first.inMatch = true;
      matches.push(newMatch(first, players[i]));
      matches[matches.length-1].startMatch();

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
