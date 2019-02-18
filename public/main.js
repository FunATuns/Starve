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
    myOverPlayer = {},
    actualAnim = [],
    enemyHandSize,
    mySideOfBattlefield,
    enemySideOfBattlefield,
    cardBeingPicked = false,
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
  switchPages("Pick");
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

  document.getElementById("myname").innerText = myPlayer.name;

  doAnim();
});


/*
Packet Info (in order):
nothing (bool)
*/
socket.on("Match", function (data ) {
  document.getElementById("enemyname").innerText = data;
  switchPages("Match");
});

/*
Packet Info (in order):
nothing (bool)
*/
socket.on("Waiting", function (data ) {
  switchPages("Wait");
});


socket.on("Picks", function (data ) {
  console.log(data.deck);
  myOverPlayer = data;

  document.getElementById("pickdeck").innerHTML = "<div id='widething'> </div>";
  for(var i = 0; i < myOverPlayer.deck.length; i++) {
    var card = myOverPlayer.deck[i];

    if(i < 15) {
      document.getElementById("pickdeck").innerHTML += getCardString(card.name, card.starve, card.attack, card.health, card.symbol,((i*90)+30) + "px",30 + "px","pd" + i);

    } 
    else {
      document.getElementById("pickdeck").innerHTML += getCardString(card.name, card.starve, card.attack, card.health, card.symbol,(((i-15)*90)+30) + "px",210 + "px","pd" + i);
    }

  }
});

function callForest() {
  var nextPick = myOverPlayer.picks[0];

  console.log(myOverPlayer.picks);

  if(!doingAnim && !cardBeingPicked) {
    doingAnim = true;
    cardBeingPicked = true;
    pickPage.innerHTML += getCardString(nextPick.name,nextPick.starve, nextPick.attack, nextPick.health, nextPick.symbol, "calc(50% - 60px)","110px","pickcard","z-index: 1000;");
    var forestDOM = document.getElementById("forest");
    var cardDescWrapDOM = document.getElementById("carddescwrapper");
    var cardDescDOM = document.getElementById("carddesc");
    var newPickDom = document.getElementById("pickcard");

    forestDOM.style.left = "calc(50% - 180px)";
    forestDOM.style.transitionDuration = "0.1s";

    cardDescDOM.innerHTML = getCardText(nextPick.name) + "<br><br>Click a card in your deck to replace";

    newPickDom.classList.add("die");

    setTimeout(function () {
      forestDOM.style.transform = "rotate(-3deg) scale(1.1)";
      setTimeout(function () {
        forestDOM.style.transform = "rotate(3deg) scale(1.1)";
        setTimeout(function () {
          forestDOM.style.transform = "rotate(-3deg) scale(1.1)";
          setTimeout(function () {
            forestDOM.style.transform = "rotate(3deg) scale(1.1)";
            setTimeout(function () {
              forestDOM.style.transform = "rotate(-3deg) scale(1.1)";
              setTimeout(function () {
                forestDOM.style.transform = "";
                forestDOM.style.transitionDuration = "0.5s";
                setTimeout(function () {
                  newPickDom.classList.remove("die");
                  newPickDom.classList.add("float");
                  setTimeout(function () {
                    forestDOM.style.left = "calc(50% - 360px)";

                    newPickDom.style.left = "calc(50% + 120px)";
                    newPickDom.style.top = "30px";

                    cardDescWrapDOM.style.opacity = "1";

                    doingAnim = false;
                  },700);
                },500);
              },100);
            },100);
          },100);
        },100);
      },100);
    },100);
  }
}

function getCardText(cardName) {
  if(cardName=="Cat") {return "The Proud Cat: It doesn't die when sacrificed, as it is resilient and listens to no one."}
  else if(cardName=="Grizzly") {return "The Vulgar Grizzly: A brutish animal, one that is controlled easily."}
  else if(cardName=="Stoat") {return "The Noble Stoat: The equivilant to animal fodder. Good to use and dispose."}
  else if(cardName=="Squirrel") {return "The Minute Stoat: A small worthless creature, begging to be sacrificed."}
  else if(cardName=="Wolf") {return "The Angry Wolf: A predator good for disposing of smaller animals."}
}

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
  
    if(cardOnDeck != -1 && sacrificeMax == sacrifices.length && (mySideOfBattlefield[battlefieldIndex] == null || (sacrifices.includes(battlefieldIndex) && !mySideOfBattlefield[battlefieldIndex].symbol.includes("sacrifice") ))) {
      socket.emit("PlaceCard",cardOnDeck,battlefieldIndex,sacrifices);
    }
  }

}


function clickCard (cardDOMID) {
  if(cardBeingPicked && !doingAnim) {
    var forestDOM = document.getElementById("forest");
    var cardDescWrapDOM = document.getElementById("carddescwrapper");
    var cardDescDOM = document.getElementById("carddesc");
    var newPickDom = document.getElementById("pickcard");
    var replaceDOM = document.getElementById(cardDOMID);
    var card = myOverPlayer.picks[0];
    var i = parseInt(cardDOMID.split("pd")[1]);

    newPickDom.style.opacity = 0;
    cardDescWrapDOM.style.opacity = 0;
    replaceDOM.style.opacity = 0;

    setTimeout(function() {
      replaceDOM.remove();
      newPickDom.remove();
      if(i < 15) {
        document.getElementById("pickdeck").innerHTML += getCardString(card.name, card.starve, card.attack, card.health, card.symbol,((i*90)+30) + "px",30 + "px","pd" + i,"opacity:0");
      } 
      else {
        document.getElementById("pickdeck").innerHTML += getCardString(card.name, card.starve, card.attack, card.health, card.symbol,(((i-15)*90)+30) + "px",210 + "px","pd" + i,"opacity:0");
      }
      replaceDOM = document.getElementById(cardDOMID);
      setTimeout(function() {
        replaceDOM.style.opacity = "1";
        forestDOM.style.left = "calc(50% - 180px)";
        socket.emit("Pick",i);
        setTimeout(function() {
          replaceDOM.style.opacity = "1";
          forestDOM.style.left = "calc(50% - 180px)";
          doingAnim = false;
          cardBeingPicked = false;
        },500);
      },100);
    },500);

  }
  else if(myTurn && !doingAnim && cardDOMID.startsWith("mh")) {
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
      newCardOnDeckDOM.style.transition = "all 0.2s ease";
      newCardOnDeckDOM.style.left = "calc(50% - 400px )";
      newCardOnDeckDOM.style.top = "calc(50vh + 50px)";
       setTimeout(function() {
        newCardOnDeckDOM.style.transition = "all 0.5s ease";
        cardOnDeck = handID;
        doingAnim = false;
      },200);
    },100);
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