
function renderAll() {
  console.log("render all");
  renderHand(myPlayer.hand);
  renderEnemyHand(enemyHandSize);
  clearBattlefield();
  renderEmBattlefield(enemySideOfBattlefield);
  renderMyBattlefield(mySideOfBattlefield);
}

function renderDeckedBattlefield() {
  for(var i = 4; i < 8; i++) {
    document.getElementById("g" + i).classList.remove("placemarker");
  }

  for(var i = 0; i < mySideOfBattlefield.length; i++) {
    if(mySideOfBattlefield[i] != null) {
      if(document.getElementById("mb" + i) != null) {
        document.getElementById("mb" + i).classList.remove("sacrifice");
        document.getElementById("mb" + i).classList.remove("sacrificeChoose");
      }
    }
  }

  if(cardOnDeck == -1) {
    document.getElementById("game").classList.remove("zoombattlefield");
  }
  else {
    document.getElementById("game").classList.add("zoombattlefield");
    if(sacrificeMax == sacrifices.length) {
      for(var i = 0; i < mySideOfBattlefield.length; i++) {
        if(mySideOfBattlefield[i] == null || sacrifices.includes(i)) {
          
          if(mySideOfBattlefield[i] != null && sacrifices.includes(i) ) { 
            document.getElementById("mb" + i).classList.add("sacrificeChoose");
          }

          if(!sacrifices.includes(i) || !mySideOfBattlefield[i].symbol.includes("sacrifice"))
          {
            document.getElementById("g" + (i + 4)).classList.add("placemarker");
          }
        }
      }
    }
    else if (sacrificeMax > sacrifices.length) {
      for(var i = 0; i < mySideOfBattlefield.length; i++) {
        if(mySideOfBattlefield[i] != null) {
          if(sacrifices.includes(i)) {
            document.getElementById("mb" + i).classList.add("sacrificeChoose");
          }
          else {
            document.getElementById("mb" + i).classList.add("sacrifice");
          }
        }
      }
    }
  }
}


function renderHand(hand){
  document.getElementById("myhandwrapper").innerHTML = "";
  for(i = 0; hand.length > i; i++) {
    document.getElementById("myhandwrapper").innerHTML += getCardString(hand[i].name, hand[i].starve, hand[i].attack, hand[i].health, hand[i].symbol,((i*100)+30) + "px",30 + "px","mh" + i);
  }
}

function renderEnemyHand(amount) {
  document.getElementById("enemyhandwrapper").innerHTML = "";
  for(i = 0; amount > i; i++) {
    document.getElementById("enemyhandwrapper").innerHTML += getCardBackString(30+(100*i) + "px","","eh" + i);
  }
}

function renderEmBattlefield(cards) {
  for(i = 0; cards.length > i; i++) {
    if(cards[i] != null) {
      document.getElementById("game").innerHTML += getCardString(cards[i].name, cards[i].starve, cards[i].attack, cards[i].health,cards[i].symbol,((i*121)+1) + "px","1px","eb" +i);
    }
    else {
      document.getElementById("game").innerHTML += "";
    }
  }
}

function renderMyBattlefield(cards) {
  for(i = 0; cards.length > i; i++) {
    if(cards[i] != null) {
      document.getElementById("game").innerHTML += getCardString(cards[i].name, cards[i].starve, cards[i].attack, cards[i].health,cards[i].symbol,((i*121)+1) + "px","162px","mb" +i);
    }
    else {
      document.getElementById("game").innerHTML += "";
    }
  }
}

function clearBattlefield(){
  document.getElementById("game").innerHTML = "<table id='bfoutlines'><tr><td id='g0'> </td><td id='g1'> </td><td id='g2'> </td><td id='g3'> </td></tr><tr><td id='g4'  onclick='battlefieldClick(this.id)'> </td><td id='g5' onclick='battlefieldClick(this.id)'> </td><td id='g6' onclick='battlefieldClick(this.id)'> </td><td id='g7' onclick='battlefieldClick(this.id)'> </td></tr></table>";
}
