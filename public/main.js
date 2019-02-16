var socket = io.connect("http://141.126.155.58:7777");

// "http://141.126.155.58:7777" - payton ip

socket.emit('Joined',null);

var loginPage = document.getElementById("Login"),
    matchPage = document.getElementById("Match"),
    pickPage = document.getElementById("Pick"),
    waitPage = document.getElementById("Wait"),
    players = [],
    orders = [],
    pot = {},
    potTotal = 0,
    myPlayer = {},
    actualAnim = [],
    enemyHandSize,
    mySideOfBattlefield,
    enemySideOfBattlefield,
    doingAnim = false,
    players = [],
    buildings = [];

switchPages("Login");

function start () {
 var name = document.getElementById("name").value;
 socket.emit('Starting',name);
}

function switchPages(page) {
  //Can be - Login, Match, Pick, or Wait
  loginPage.style.display = "none";
  matchPage.style.display = "none";
  pickPage.style.display = "none";
  waitPage.style.display = "none";

  document.getElementById(page).style.display = "block";
}

socket.on("You'reIn", function(player){
  switchPages("Wait");
  myplayer = player;
});

document.onkeypress = function (evt) {
}

/*
Packet Info (in order):
myPlayer (object)
enemyHandSize (int)
mySideOfBattlefield (array)
enemySideOfBattlefield (array)
myTurn (bool)
turnStartTime (int)
*/
socket.on("MatchUpdate", function (_myPlayer, _enemyHandSize, _mySideOfBattlefield, _enemySideOfBattlefield, _myTurn, _turnStartTime ) {
  myPlayer = _myPlayer;
  actualAnim = actualAnim.concat(_myPlayer.animate);
  enemyHandSize = _enemyHandSize;
  mySideOfBattlefield = _mySideOfBattlefield;
  enemySideOfBattlefield = _enemySideOfBattlefield;
  myTurn = _myTurn;
  turnStartTime = _turnStartTime;

  doAnim();
});


/*
Packet Info (in order):
nothing (bool)
*/
socket.on("Match", function (data ) {
  switchPages("Match");
});

/*
Packet Info (in order):
nothing (bool)
*/
socket.on("Wait", function (data ) {
  switchPages("Wait");
});

function getCardString(name, attack, health, imgsrc,left, top, id, extraStyle = ""){

  var styleString = "";

  if(left != null) {
    styleString += "left: " + left + ";";
  }

  if( top != null) {
    styleString += "top: " + top + ";";
  }

  styleString += extraStyle;

  return "<div style='"+ styleString + "' id='" + id + "' class='card'><p class='ctitle'>" + name + "</p><div class='ccimg'><img class='cimg' style='width: 120px; height: 70px' src='" + imgsrc + "'></div><p class='ca'>" + attack + "</p><p class='ch'>" + health + "</p><p></p></div>";
}

function getCardBackString(left, top, id, extraStyle = ""){
  var styleString = "";

  if(left != null) {
    styleString += "left: " + left + ";";
  }

  if( top != null) {
    styleString += "top: " + top + ";";
  }

  styleString += extraStyle;

  return "<div style='"+ styleString + "' id='" + id + "' class='cardback'></div>";
}
