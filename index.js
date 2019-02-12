// Setup basic express server
var debug = true;

var port = debug ? 7777 : 27016;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var players = [];


<<<<<<< HEAD
=======
var potTotal = 0;

var pot = {

};

var orders = [];

setInterval( function() {
  lastSpin = Date.now();
  spin();
},30000);
>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7

server.listen(7777, function () {
  console.log('Server listening at port %d', port);
});
// Routing
app.use(express.static(__dirname + '/public'));


io.on('connection', function (socket) {
  
console.log('User Connected');
  // when the client emits 'add user', this listens and executes
  
  socket.on('Starting', function (name) {
    var player = newPlayer(socket.id, name);
    players.push(player);
<<<<<<< HEAD
    socket.emit("You'reIn",player);
=======
    socket.emit("You'reIn",player, Date.now() - lastSpin);
    sendOut("casino");
    sendOut("drugs");
>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7
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

<<<<<<< HEAD
=======
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

  socket.on('BetMore', function (bet) {
    if(!spinning) {
      var player = getPlayerByID(socket.id);
      if(player) {
        if(!pot[player.username]) {
          pot[player.username] = 0;
        }

        if(player.money >= 100) {
          player.money -= 100;
          pot[player.username] += 100;
          potTotal += 100;
          sendOut("casino");
        }
      }
    }
  });

  socket.on('BetLess', function (bet) {
    if(!spinning) {
      var player = getPlayerByID(socket.id);
      if(pot[player.username] >= 100) {
        player.money += 100;
        pot[player.username] -= 100;
        potTotal -= 100;
        sendOut("casino");
      }
    }
  });

>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7
  socket.on('disconnect', function () {
    for(var i = 0; i < players.length;i++) {
      if(players[i].id == socket.id) {
        players.splice(i,1);
      }
    }
  });
});



function newPlayer (id, name) {
  return {
    id: id,
    username: name,
    type: "player",
    x: 5,
    y: 4,
  };
}

<<<<<<< HEAD
=======
function sendOut(type) {
  if(type == "casino") {
    for(var i = 0; i < players.length;i++) {
      sendByID(players[i].id,"CurrentCasino",{myPlayer: players[i], pot: pot, total: potTotal, players: players});
    }
  }
  else if (type == "drugs") {
    for(var i = 0; i < players.length;i++) {
      sendByID(players[i].id,"CurrentDrugs",{myPlayer: players[i], orders: orders, players: players});
    }
  }
  else if (type == "players") {
    sendByID(players[i].id,"CurrentCasino",{players: players});
  }
}

function updatePlayer(player, loc) {
  switch(player.action) {
    case "tree":
      var treeTask = getTaskByName(loc,"tree");
      console.log("GotTask");
      if(treeTask != undefined) {
        if(player.treeStuff.turnsChopping == 5) {
          player.action = "";
          player.treeStuff.turnsChopping = 0;
          player.actionMSG = "Done chopping!";

          console.log(TREE.getItemByTree(treeTask.type));

        }
        else {
          player.treeStuff.turnsChopping += 1;
          player.actionMSG = "Chopping...";
          console.log("Chopping...");
        }
      }
      else
      {
        player.action = "";
        player.treeStuff.turnsChopping = 0;
      }


    break
  }
}

>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7
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
<<<<<<< HEAD
=======

function getTaskByName(loc, name) {
  for(var i in loc.tasks) {
    if(loc.tasks[i].name == name)
      return loc.tasks[i];
  }
}

function buildWorld () {
  var currentLoc;
  for(var i = 0; i < loc.length; i++) {
    currentLoc = loc[i];
    currentLoc.drops = [];

    world[i] = currentLoc;
  }
  console.log("Built World");
}

function priceFromDrug(drug) {
  if( drug == "weed") {
    return {cost:100, risk: .1};
  }
  else if (drug == "coke") {
    return {cost:300, risk: .5};
  }
  else if (drug == "heroin") {
    return {cost:600, risk: 1};
  }
  else if (drug == "meth") {
    return {cost:1000, risk: 2};
  }
}

function multiplierFromCountry(country) {
  if( country == "america") {
    return {cost:1, risk: 1};
  }
  else if (country == "canada") {
    return {cost:2, risk: 1.5};
  }
  else if (country == "mexico") {
    return {cost:3, risk: 4};
  }
  else if (country == "china") {
    return {cost:8, risk: 10};
  }
}
>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7
