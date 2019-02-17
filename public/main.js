var socket = io.connect("http://141.126.155.58:7777");

// "http://141.126.155.58:7777" - payton ip

socket.emit('Joined',null);

var loginPage = document.getElementById("Login"),
    matchPage = document.getElementById("Match"),
    pickPage = document.getElementById("Pick"),
    waitPage = document.getElementById("Wait"),
    cardOnDeck = -1,
    sacrifices = [],
    sacrificeMax = -1,
    myPlayer = {},
    actualAnim = [],
    enemyHandSize,
    mySideOfBattlefield,
    enemySideOfBattlefield,
    doingAnim = false;

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


function getCardString(name, starve, attack, health, symbol,left, top, id, extraStyle = ""){

  //positioning
  var styleString = "";
  if(left != null) {
    styleString += "left: " + left + ";";
  }
  if( top != null) {
    styleString += "top: " + top + ";";
  }
  styleString += extraStyle;

  //add little bloods for needed sacrifices
  var starveString = "";
  for(var i = 0; i < starve; i++) {
    starveString += "<img class='cblood' style='width: 20px; height: 30px; right:" + ((i*12) + 5 ) + "px' src='images/blood.png'>"
  } 

  //symbol
  var symbolString = "";
  var firstSymbol = symbol.split(" ")[0];
  if(firstSymbol != "none" ) {
    symbolString += "<img class='csym' style='width: 30px; height: 40px;' src='images/"+firstSymbol+".png'>";
  }

  return "<div style='"+ styleString + "' id='" + id + "' class='card' onclick='clickCard(this.id)'><p class='ctitle'>" + name + "</p>" + starveString +"<div class='ccimg'><img class='cimg' style='width: 120px; height: 70px' src='images/" + name + ".png'></div>" + symbolString +"<p class='ca'>" + attack + "</p><p class='ch'>" + health + "</p><p></p></div>";
}

function getSymbolText(sym) {
  if(sym == "sacrifice") {
    return "This beast doesn't die when sacrificed";
  }

}

document.oncontextmenu = function (evt) {
  anim_returnDeckedCard(false);

  sacrifices = [];
  sacrificeMax = -1;

  renderDeckedBattlefield();



  return false;
}

function battlefieldClick(battlefieldDOMID) {
  console.log("hi");

  if(!doingAnim) {
    var battlefieldIndex = parseInt(battlefieldDOMID.split("g")[1])-4;
  
    if(cardOnDeck != -1 && sacrificeMax == sacrifices.length && (mySideOfBattlefield[battlefieldIndex] == null || (sacrifices.includes(battlefieldIndex) && !mySideOfBattlefield[battlefieldIndex].symbol.contains("sacrifice") ))) {
      socket.emit("PlaceCard",cardOnDeck,battlefieldIndex,sacrifices);
    }
  }

}


function clickCard (cardDOMID) {
  if(myTurn && !doingAnim && cardDOMID.startsWith("mh")) {
    doingAnim = true;
    anim_returnDeckedCard(true);
    

    var newCardOnDeckDOM = document.getElementById(cardDOMID);
    var handID = parseInt(cardDOMID.split("mh")[1]);
    
    cardOnDeck = handID;

    sacrifices = [];
    sacrificeMax = myPlayer.hand[handID].starve;

    renderDeckedBattlefield();

    
    $("#" + cardDOMID).appendTo("#Match");
    newCardOnDeckDOM.style.left = "calc(50% - 370px + " + handID * 100 +"px)";
    newCardOnDeckDOM.style.top = "calc(100vh - 190px )";
    newCardOnDeckDOM.classList.add("cardfloat");
    setTimeout(function() {
      newCardOnDeckDOM.style.left = "calc(50% - 400px )";
      newCardOnDeckDOM.style.top = "calc(50vh + 50px)";
       setTimeout(function() {
        cardOnDeck = handID;
        doingAnim = false;
      },300);
    },200);
  }
  else if(myTurn && !doingAnim && cardDOMID.startsWith("mb")) {
    var battlefieldID = parseInt(cardDOMID.split("mb")[1]);
    if(cardOnDeck != -1 && sacrificeMax > sacrifices.length && !sacrifices.includes(battlefieldID)) {
      sacrifices.push(battlefieldID);

      renderDeckedBattlefield();
    }
  }
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

function endTurn(){
  if(myTurn) {
    socket.emit("EndTurn","");
  }
}