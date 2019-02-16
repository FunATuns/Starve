var socket = io.connect("http://127.0.0.1:7777");

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
  enemyHandSize = _enemyHandSize;
  mySideOfBattlefield = _mySideOfBattlefield;
  enemySideOfBattlefield = _enemySideOfBattlefield;
  myTurn = _myTurn;
  _turnStartTime = _turnStartTime;

  doAnim();
  /*
  renderHand(myPlayer.hand);
  renderEnemyHand(enemyHandSize);
  renderEmBattlefield(enemySideOfBattlefield);
  renderMyBattlefield(mySideOfBattlefield);
  */
});

/*
  ANIMATE OBJECTS
  DRAW CARD:[animtype (string), myteam (bool), handindex (int)]

*/ 

function doAnim() {

  if(!doingAnim) {
    doingAnim = true;
  
    console.log(myPlayer.animate);

    //get the animate we are on
    var currentAnim = myPlayer.animate[0];

    //get the anim type and run corresponding functino
    if(currentAnim[0] == "drawcard") {
      anim_drawCard(currentAnim);
    }
  }
}

function anim_drawCard(anim) {
  //check if we are drawing or if our enemy is
  if(anim[1]) {
    //we are

    //get the card
    var currentCard = myPlayer.hand[anim[2]];

    //make our card, position it on top of our deck, flipped upside
    matchPage.innerHTML += getCardString(currentCard.name,currentCard.attack, currentCard.health,"","calc(92.5% - 121px)","79vh","mh" + anim[2],"opacity:0;");

    //get our card
    var currentCardDom = document.getElementById("mh" + anim[2]);

    setTimeout(function() {
      currentCardDom.style.opacity = "1";
      setTimeout(function() {
        $("#mh" + anim[2]).appendTo("#mffour");
        currentCardDom.style.left = anim[2] * 100 + "px";
        currentCardDom.style.top = "30px";
      },1000);
    },500);




  }
  else {
    //our enemy is
  }


}



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

function renderHand(hand){
  document.getElementById("mffour").innerHTML = "";
  for(i = 0; hand.length > i; i++) {
    document.getElementById("mffour").innerHTML += getCardString(hand[i].name, hand[i].attack, hand[i].health, hand[i].name + ".png",i*100 + "px",30 + "px","m" + i);
  }
}

function renderEnemyHand(amount) {
  document.getElementById("effour").innerHTML = "";
  for(i = 0; amount > i; i++) {
    document.getElementById("effour").innerHTML += "<li style='left: " + 100 * i + "px; background-color: #3D3D3D' id='m" + i + "' class='card'></li>"
  }
}

function renderEmBattlefield(cards) {
  clearEmBattlefield();
  for(i = 0; cards.length > i; i++) {
    if(cards[i] != null) {
      document.getElementById("g" + i).innerHTML += getCardString(cards[i].name, cards[i].attack, cards[i].health,"",((i*121)+1 )  + "px","1px","g" +i);
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
      document.getElementById("g" + (i + 4)).innerHTML += getCardString(cards[i].name, cards[i].attack, cards[i].health,"",(i*121)+1,162,"g" +i);
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
