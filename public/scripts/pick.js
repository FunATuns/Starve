function pickCard(cardDOMID) {
  var forestDOM = document.getElementById("forest");
  var cardDescWrapDOM = document.getElementById("carddescwrapper");
  var cardDescDOM = document.getElementById("carddesc");
  var newPickDom = document.getElementById("pickcard");
  var replaceDOM = document.getElementById(cardDOMID);
  var card = myOverPlayer.picks[0];
  if(cardDOMID.startsWith("pd")) {
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
}


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
  else if(cardName=="Beehive") {return "The Stout Beehive: A home to the most annoying insects. Gives you a bee everytime it's attacked."}
  else if(cardName=="Bee") {return "The Hyper Bee: A small creature that attacks the opponent directly."}
  else if(cardName=="Rabbit") {return "The Stupid Rabbit: A worthless creature good for absorbing shots."}
  else if(cardName=="Warren") {return "The Compact Warren: A home for all sorts of vermin. Gives you 2 rabbits when played."}
  else if(cardName=="Deer") {return "The Coward Deer: After bucking it's antlers in attack, it quickly retreats to a nearby space."}
  else if(cardName=="Sanke") {return "The Sly Snake: It's deadly poison kills anything it touches. It's a ruthless creature."}
}