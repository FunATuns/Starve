

/*
  ANIMATE OBJECTS
  DRAWCARD:[animtype (string), myteam (bool), handindex (int)]
  STARTTURN:[animtype (string), myturn (bool)]
  ENDTURN:[animtype (string)]
  ATTACKBEAST:[animtype (string), mybeast (bool), battlefieldindex (int)]
  HITBEAST:[animtype (string), mybeast (bool), battlefieldindex (int), updatedbeast (object)]
  ADDCARD:[animtype (string), mycard (bool), handindex (int), card (object)]
  DIEBEAST:[animtype (string), mybeast (bool), battlefieldindex (int)]
  PLACECARD:[animtype (string), mybeast (bool), handindex (int), battlefieldindex (int)]
  DEV:[animtype (string), dev (int)]

*/ 

function doAnim(force = false) {

  //are we already animing?
  if(!doingAnim || force) {
    doingAnim = true;
  
    console.log(actualAnim);

    //get the animate we are on
    var currentAnim = actualAnim[0];

    //get the anim type and run corresponding functino
    try {
      if(currentAnim[0] == "drawcard") {
        anim_drawCard(currentAnim);
      }
      else if(currentAnim[0] == "startturn") {
        anim_startTurn(currentAnim);
      }
      else if(currentAnim[0] == "endturn") {
        anim_endTurn(currentAnim);
      }
      else if(currentAnim[0] == "attackbeast") {
        anim_attackBeast(currentAnim);
      }
      else if(currentAnim[0] == "diebeast") {
        anim_dieBeast(currentAnim);
      }
      else if(currentAnim[0] == "hitbeast") {
        anim_hitBeast(currentAnim);
      }
      else if(currentAnim[0] == "placecard") {
        anim_placeCard(currentAnim);
      }
      else if(currentAnim[0] == "addcard") {
        anim_addCard(currentAnim);
      }
      else if(currentAnim[0] == "gamedone") {
        anim_gameDone(currentAnim);
      }
      else if(currentAnim[0] == "dev") {
        anim_dev(currentAnim);
      }
      else {
        endAnim();
      }
    }
    catch(err) {
      endAnim();
    }
    
  }
}

function endAnim() {
  //cut off the anim we just did
  actualAnim.splice(0,1);


  //all anims done?
  if(actualAnim.length == 0) {
    //reset us doing an anim
    doingAnim = false;

    //yes render everything
    renderAll();
  }
  else {
    //nope, render the next one
    doAnim(true);
  }
}

function anim_gameDone(anim) {
  if(anim[1]) {
    document.getElementById("myTurn").innerText = "You have won!";
    document.getElementById("myTurn").style.opacity = "1";
  }
  else {
    document.getElementById("myTurn").innerText = "You lost :(";
    document.getElementById("myTurn").style.opacity = "1";
  }

  cardOnDeck = -1;
  sacrifices = [];
  sacrificeMax = -1;
  myPlayer = {hand:[]};
  actualAnim = [];
  enemyHandSize = 0;
  mySideOfBattlefield = [null,null,null,null];
  enemySideOfBattlefield = [null,null,null,null];

  setTimeout(function () {
    document.getElementById("myTurn").style.opacity = "0";
    anim_dev([null,0]);
    switchPages("Pick");
    endAnim();
  },3000);
}

function anim_addCard(anim) {
  if(anim[1]) {
    document.getElementById("myhandwrapper").innerHTML += getCardString(anim[3].name, anim[3].starve, anim[3].attack, anim[3].health,anim[3].symbol,( (100 * anim[2]) +30) + "px","30px","mh" +anim[2],"opacity:0");

    setTimeout(function () {
      document.getElementById("mh" + anim[2]).style.opacity = "1";
      setTimeout(function () {
        endAnim();
      },500);
    },100);
  }
  else  {
    document.getElementById("enemyhandwrapper").innerHTML += getCardBackString(( (100 * anim[2]) +30) + "px","0px","eh" +anim[2],"opacity:0");

    setTimeout(function () {
      document.getElementById("eh" + anim[2]).style.opacity = "1";
      setTimeout(function () {
        endAnim();
      },500);
    },100);
  }
}

function anim_placeCard(anim) {
  //check if we are drawing or if our enemy is
  if(anim[1]) {
    //we are

    //get the card
    var currentCard = myPlayer.hand[anim[2]];
    //get our card
    var currentCardDom = document.getElementById("mh" + anim[2]);

    //unzoom the battlefield
    document.getElementById("game").classList.remove("zoombattlefield");

    //are we on deck
    if(anim[2] == cardOnDeck) {

      currentCardDom.style.left = "calc(50% - 242px + " + ((anim[3] * 121) + 1) +"px)";
      currentCardDom.style.top = "calc(50vh - 60px)";
      currentCardDom.classList.remove("cardfloat");
      setTimeout(function() {
        currentCardDom.remove();
        document.getElementById("game").innerHTML += getCardString(mySideOfBattlefield[anim[3]].name, mySideOfBattlefield[anim[3]].starve,  mySideOfBattlefield[anim[3]].attack, mySideOfBattlefield[anim[3]].health,mySideOfBattlefield[anim[3]].symbol,((anim[3]*121)+1) + "px","162px","mb" +anim[3]);
        cardOnDeck = -1;
        sacrificeMax = -1;
        sacrifices = [];
        renderDeckedBattlefield();
        endAnim();
      },600);
    }
    else {
      $("#mh" + anim[2] ).appendTo("#Match");
      newCardOnDeckDOM.style.left = "calc(50% - 370px + " + anim[2] * 100 +"px)";
      newCardOnDeckDOM.style.top = "calc(100vh - 190px )";

      setTimeout(function() {
        currentCardDom.style.left = "calc(50% - 242px + " + ((anim[3] * 121) + 1) +"px)";
        currentCardDom.style.top = "calc(50vh - 60px)";
        setTimeout(function() {
          currentCardDom.remove();
          document.getElementById("game").innerHTML += getCardString(mySideOfBattlefield[anim[3]].name, mySideOfBattlefield[anim[3]].starve,  mySideOfBattlefield[anim[3]].attack, mySideOfBattlefield[anim[3]].health,mySideOfBattlefield[anim[3]].symbol,((anim[3]*121)+1) + "px","162px","mb" +anim[3]);
          cardOnDeck = -1;
          sacrificeMax = -1;
          sacrifices = [];
          renderDeckedBattlefield();
          endAnim();
        },600);
      },600);
    }

  }
  else {
    //we are
    //get our card
    var currentCardDom = document.getElementById("eh" + anim[2]);

    $("#eh" + anim[2] ).appendTo("#Match");
    currentCardDom.style.left = "calc(50% - 370px + " + anim[2] * 100 +"px)";
    currentCardDom.style.top = "-105px";

    setTimeout(function() {
      currentCardDom.style.left = "calc(50% - 242px + " + ((anim[3] * 121) + 1) +"px)";
      currentCardDom.style.top = "calc(50vh - 221px )";
      setTimeout(function() {
        currentCardDom.remove();
        document.getElementById("game").innerHTML += getCardString(enemySideOfBattlefield[anim[3]].name, enemySideOfBattlefield[anim[3]].starve, enemySideOfBattlefield[anim[3]].attack, enemySideOfBattlefield[anim[3]].health,enemySideOfBattlefield[anim[3]].symbol,((anim[3]*121)+1) + "px","0px","eb" +anim[3]);
        endAnim();
      },600);
    },600);
  }
}

function anim_drawCard(anim) {
  //check if we are drawing or if our enemy is
  if(anim[1]) {
    //we are

    //get the card
    var currentCard = myPlayer.hand[anim[2]];

    //make our card, position it on top of our deck, opacity 0
    matchPage.innerHTML += getCardString(currentCard.name, currentCard.starve,currentCard.attack, currentCard.health,currentCard.symbol,"calc(92.5% - 121px)","79vh","mh" + anim[2],"opacity:0;");

    //get our card
    var currentCardDom = document.getElementById("mh" + anim[2]);

    setTimeout(function() {
      //make it appear
      currentCardDom.style.opacity = "1";
      currentCardDom.classList.add("cardfloat");
      setTimeout(function() {
        //move it to its spot
        currentCardDom.style.transition = "all 0.2s ease";
        currentCardDom.style.left = "calc(50% - 370px + " + anim[2] * 100 +"px)";
        currentCardDom.style.top = "calc(100vh - 190px )";
        currentCardDom.classList.remove("cardfloat");
        setTimeout(function() {
          currentCardDom.style.transition = "all 0.5s ease";
          //put it in the hand element and make sure its positioned correctly
          currentCardDom.style.left = ( (100 * anim[2]) +30) + "px";
          currentCardDom.style.top = "30px";
          $("#mh" + anim[2]).appendTo("#myhandwrapper");
          endAnim();
        },200);
      },600);
    },500);




  }
  else {
    //our enemy is
    
    //make our card, position it on top of our deck, opacity 0
    matchPage.innerHTML += getCardBackString("calc(92.5% - 121px)","calc(5vh - 105px)","eh" + anim[2],"opacity:0;");

    //get our card
    var currentCardDom = document.getElementById("eh" + anim[2]);

    setTimeout(function() {
      //make it appear
      currentCardDom.style.opacity = "1";
      currentCardDom.classList.add("cardfloat");
      setTimeout(function() {
        //move it to its spot
        currentCardDom.style.transition = "all 0.2s ease";
        currentCardDom.style.left = "calc(50% - 370px + " + anim[2] * 100 +"px)";
        currentCardDom.style.top = "-105px";
        currentCardDom.classList.remove("cardfloat");
        setTimeout(function() {
          currentCardDom.style.transition = "all 0.5s ease";
          //put it in the hand element and make sure its positioned correctly
          currentCardDom.style.left = ( (100 * anim[2]) +30) + "px";
          currentCardDom.style.top = "0";
          $("#eh" + anim[2]).appendTo("#enemyhandwrapper");
          endAnim();
        },200);
      },600);
    },500);
  }
}

function anim_returnDeckedCard(force = false) {
  if((cardOnDeck != -1 && !doingAnim) || (cardOnDeck != -1 && force)) {
    doingAnim = true;
    var storeDeck = cardOnDeck;
    cardOnDeck = -1;

    sacrifices =  [];
    sacrificeMax = -1;

    var cardOnDeckDOM = document.getElementById("mh" + storeDeck);
    cardOnDeckDOM.style.transition = "all 0.2s ease";
    cardOnDeckDOM.style.left = "calc(50% - 370px + " + storeDeck * 100 +"px)";
    cardOnDeckDOM.style.top = "calc(100vh - 190px )";
    cardOnDeckDOM.classList.remove("cardfloat");
    setTimeout(function() {
      //put it in the hand element and make sure its positioned correctly
      cardOnDeckDOM.style.transition = "all 0.5s ease";
      cardOnDeckDOM.style.left = ( (100 * storeDeck) +30) + "px";
      cardOnDeckDOM.style.top = "30px";
      $("#mh" + storeDeck).appendTo("#myhandwrapper");
      doingAnim = false;

    },200);

  
  }
}

function anim_endTurn(anim){
  //DINNNNG

  document.getElementById("bell").style.color = "#313131";
  document.getElementById("game").classList.remove("zoombattlefield");



  anim_returnDeckedCard(true);
  renderDeckedBattlefield();

  setTimeout(function () {
    endAnim();
  }, 500);
}

function anim_attackBeast(anim){
  console.log("hit");

  //whose beast is it
  if(anim[1]) {
    //ours
    var beastDOM = document.getElementById("mb" + anim[2]);
    var beast = mySideOfBattlefield[anim[2]];


    beastDOM.classList.add("cardfloat");

    setTimeout(function () {
      beastDOM.style.transition = "all 0.5s cubic-bezier(.88,-0.01,.9,.62)";

      if(beast.symbol.includes("fly")) {
        beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) - 100) + "px";

      }
      else {
        beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) - 30) + "px";
      }
      setTimeout(function () {
        endAnim();
        beastDOM.style.transition = "all 0.5s cubic-bezier(.17,.8,.44,.99)";
        if(beast.symbol.includes("fly")) {
          beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) + 100) + "px";
        }
        else {
          beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) + 30) + "px";
        }
        setTimeout(function () {
          beastDOM.style.transition = "all 0.5s ease";
          beastDOM.classList.remove("cardfloat");
        }, 500);
      }, 500);
    }, 500);

  }
  else {
    //enemies
    var beastDOM = document.getElementById("eb" + anim[2]);
    var beast = enemySideOfBattlefield[anim[2]];
    
    beastDOM.classList.add("cardfloat");

    setTimeout(function () {
      beastDOM.style.transition = "all 0.5s cubic-bezier(.88,-0.01,.9,.62)";
      
      if(beast.symbol.includes("fly")) {
        beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) + 100) + "px";
      }
      else {
        beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) + 30) + "px";
      }
      setTimeout(function () {
        endAnim();
        beastDOM.style.transition = "all 0.5s cubic-bezier(.17,.8,.44,.99)";
        if(beast.symbol.includes("fly")) {
          beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) - 100) + "px";
        }
        else {
          beastDOM.style.top = (parseInt(beastDOM.style.top.split("px")[0]) - 30) + "px";
        }
        setTimeout(function () {
          beastDOM.style.transition = "all 0.5s ease";
          beastDOM.classList.remove("cardfloat");
        }, 500);
      }, 500);
    }, 500);
  }
}

function anim_dev(anim){
  endAnim();

  var liveDOM = document.getElementById("mylives");

  liveDOM.innerText = anim[1];

  if(anim[1] < -20) {
    anim[1] = -20;
  }
  else if(anim[1] > 20) {
    anim[1] = 20;
  }

  var adjustedLives = anim[1];
  adjustedLives = adjustedLives/40;
  adjustedLives *= -100;

  adjustedLives += 50;

  console.log(adjustedLives);

  liveDOM.style.top = "calc("+ adjustedLives + "% - " + adjustedLives +"px)";
}


function anim_hitBeast(anim){
  console.log("hit");

  //whose beast is it
  if(anim[1]) {
    //ours
    var beastDOM = document.getElementById("mb" + anim[2]);

    setTimeout(function () {
      beastDOM.style.transition = "transform 0.1s ease";
      beastDOM.style.transform = "rotate(2deg)";
      setTimeout(function () {
        beastDOM.style.transform = "rotate(-2deg)";
        setTimeout(function () {
          beastDOM.style.transform = "rotate(2deg)";
          setTimeout(function () {
            beastDOM.style.transform = "rotate(-2deg)";
            setTimeout(function () {
              beastDOM.style.transform = "rotate(0deg)";
              setTimeout(function () {
                beastDOM.remove();
                document.getElementById("game").innerHTML += getCardString(anim[3].name, anim[3].starve, anim[3].attack, anim[3].health,anim[3].symbol,((anim[2]*121)+1) + "px","162px","mb" +anim[2]);
                setTimeout(function () {
                  endAnim();
                }, 200);
              }, 200);
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }, 100);

  }
  else {
    var beastDOM = document.getElementById("eb" + anim[2]);
    
    setTimeout(function () {
      beastDOM.style.transition = "transform 0.1s ease";
      beastDOM.style.transform = "rotate(2deg)";
      setTimeout(function () {
        beastDOM.style.transform = "rotate(-2deg)";
        setTimeout(function () {
          beastDOM.style.transform = "rotate(2deg)";
          setTimeout(function () {
            beastDOM.style.transform = "rotate(-2deg)";
            setTimeout(function () {
              beastDOM.style.transform = "rotate(0deg)";
              setTimeout(function () {
                beastDOM.remove();
                document.getElementById("game").innerHTML += getCardString(anim[3].name, anim[3].starve, anim[3].attack, anim[3].health,anim[3].symbol,((anim[2]*121)+1) + "px","0px","eb" +anim[2]);

                setTimeout(function () {
                  endAnim();
                }, 200);
              }, 200);
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  }
}


function anim_dieBeast(anim){
  console.log("hit");

  //whose beast is it
  if(anim[1]) {
    //ours
    var beastDOM = document.getElementById("mb" + anim[2]);

    beastDOM.classList.add("die");

    setTimeout(function () {
      beastDOM.remove();
      endAnim();
    }, 500);

  }
  else {
    //enemies
    var beastDOM = document.getElementById("eb" + anim[2]);
    
    beastDOM.classList.add("die");

    setTimeout(function () {
      beastDOM.remove();
      endAnim();
    }, 500);
  }
}

function anim_startTurn(anim){
  if(anim[1]) {
    document.getElementById("myTurn").innerText = "It is your turn.";
    document.getElementById("myTurn").style.opacity = "1";
    document.getElementById("bell").style.color = "white";
  }
  else {
    document.getElementById("myTurn").innerText = "It is your opponent's turn.";
    document.getElementById("myTurn").style.opacity = "1";
    document.getElementById("bell").style.color = "#313131";
  }
  setTimeout(function(){
    document.getElementById("myTurn").style.opacity = "0";
    setTimeout(function(){
      endAnim();
    }, 500);
  },2000);
}