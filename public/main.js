var socket = io.connect("http://141.126.155.58:7777");

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
socket.on("MatchUpdate", function (myPlayer, enemyHandSize, mySideOfBattlefield, enemySideOfBattlefield, myTurn, turnStartTime ) {
  renderHand(myPlayer.hand);
  renderEnemyHand(enemyHandSize);
  renderEmBattlefield(enemySideOfBattlefield);
  renderMyBattlefield(mySideOfBattlefield);
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

function getCardString(name, attack, health, imgsrc, id){
  return "<li style='left: " + 160 * id + "px;' id='m" + id + "' class='card'><p class='ctitle'>" + name + "</p><div class='ccimg'><img class='cimg' style='width: 120px; height: 70px' src='" + imgsrc + "'></div><p class='ca'>" + attack + "</p><p class='ch'>" + health + "</p><p></p></li>";
}

function renderHand(hand){
  document.getElementById("mffour").innerHTML = "";
  for(i = 0; hand.length > i; i++) {
    document.getElementById("mffour").innerHTML += getCardString(hand[i].name, hand[i].attack, hand[i].health, hand[i].name + ".png", i);
  }
}

function renderEnemyHand(amount) {
  document.getElementById("effour").innerHTML = "";
  for(i = 0; amount > i; i++) {
    document.getElementById("effour").innerHTML += "<li style='left: " + 160 * i + "px; background-color: #3D3D3D' id='m" + i + "' class='card'></li>"
  }
}

function renderEmBattlefield(cards) {
  clearEmBattlefield();
  for(i = 0; cards.length > i; i++) {
    if(cards[i] != null) {
      document.getElementById("g" + i).innerHTML += "<div id='gc" + i + "' class='card'><p class='ctitle'>" + cards[i].name + "</p><div class='ccimg'><img class='cimg' style='width: 120px; height: 70px' src='" + cards[i].imgsrc + "'></div><p class='gca'>" + cards[i].attack + "</p><p class='gch'>" + cards[i].health + "</p><p></p></div>";
    }
    else {
      document.getElementById("g" + i).innerHTML += "";
    }
  }
}

function renderMyBattlefield(cards) {
  clearMyBattlefield();
  for(i = 0; cards.length > i; i++) {
    if(cards[i] != null) {
      document.getElementById("g" + (i + 4)).innerHTML += "<div id='gc" + (i + 4) + "' class='card'><p class='ctitle'>" + cards[i].name + "</p><div class='ccimg'><img class='cimg' style='width: 120px; height: 70px' src='" + cards[i].imgsrc + "'></div><p class='gca'>" + cards[i].attack + "</p><p class='gch'>" + cards[i].health + "</p><p></p></div>";
    }
    else {
      document.getElementById("g" + (i + 4)).innerHTML += "";
    }
  }
}

function clearEmBattlefield(){
  for(i=0; i<3; i++){
    document.getElementById("g" + i).innerHTML = "";
  }
}

function clearMyBattlefield(){
  for(i=4; i<7; i++){
    document.getElementById("g" + i).innerHTML = "";
  }
}