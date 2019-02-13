// Setup basic express server
var debug = true;

var port = debug ? 7777 : 27016;

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var players = [];



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
    socket.emit("You'reIn",player);
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
