

/*
ANIMATE OBJECTS
DRAWCARD:[animtype (string), myteam (bool), handindex (int)]
STARTTURN:[animtype (string), myturn (bool)]

*/ 

function doAnim() {

  //are we already animing?
  if(!doingAnim) {
    doingAnim = true;
  
    console.log(actualAnim);

    //get the animate we are on
    var currentAnim = actualAnim[0];

    //get the anim type and run corresponding functino
    if(currentAnim[0] == "drawcard") {
      anim_drawCard(currentAnim);
    }
    else if(currentAnim[0] == "startturn") {
      anim_startTurn(currentAnim);
    }
    else {
      endAnim();
    }
  }
}

function endAnim() {
  //cut off the anim we just did
  actualAnim.splice(0,1);

  //reset us doing an anim
  doingAnim = false;

  //all anims done?
  if(actualAnim.length == 0) {
    //yes render everything
    renderAll();
  }
  else {
    //nope, render the next one
    doAnim();
  }
}

function anim_drawCard(anim) {
  //check if we are drawing or if our enemy is
  if(anim[1]) {
    //we are

    //get the card
    var currentCard = myPlayer.hand[anim[2]];

    //make our card, position it on top of our deck, opacity 0
    matchPage.innerHTML += getCardString(currentCard.name,currentCard.attack, currentCard.health,"images/"+currentCard.name + ".png","calc(92.5% - 121px)","79vh","mh" + anim[2],"opacity:0;");

    //get our card
    var currentCardDom = document.getElementById("mh" + anim[2]);

    setTimeout(function() {
      //make it appear
      currentCardDom.style.opacity = "1";
      currentCardDom.classList.add("cardfloat");
      setTimeout(function() {
        //move it to its spot
        currentCardDom.style.left = "calc(50% - 370px + " + anim[2] * 100 +"px)";
        currentCardDom.style.top = "calc(100vh - 190px )";
        currentCardDom.classList.remove("cardfloat");
        setTimeout(function() {
          //put it in the hand element and make sure its positioned correctly
          currentCardDom.style.left = ( (100 * anim[2]) +30) + "px";
          currentCardDom.style.top = "30px";
          $("#mh" + anim[2]).appendTo("#myhandwrapper");
          endAnim();
        },600);
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
        currentCardDom.style.left = "calc(50% - 370px + " + anim[2] * 100 +"px)";
        currentCardDom.style.top = "-105px";
        currentCardDom.classList.remove("cardfloat");
        setTimeout(function() {
          //put it in the hand element and make sure its positioned correctly
          currentCardDom.style.left = ( (100 * anim[2]) +30) + "px";
          currentCardDom.style.top = "0";
          $("#eh" + anim[2]).appendTo("#enemyhandwrapper");
          endAnim();
        },600);
      },600);
    },500);
  }
}

function anim_startTurn(anim){
  if(anim[1]) {
    document.getElementById("myTurn").style.opacity = "1";
    document.getElementById("bell").style.color = "white";
  }
  else {
    document.getElementById("enTurn").style.opacity = "1";
    document.getElementById("bell").style.color = "#313131";
  }
  setTimeout(function(){
    document.getElementById("enTurn").style.opacity = "0";
    document.getElementById("myTurn").style.opacity = "0";
    setTimeout(function(){
      endAnim();
    }, 500);
  },2000);
}