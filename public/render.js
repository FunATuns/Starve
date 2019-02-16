
function renderAll() {
  console.log("render all");
  renderHand(myPlayer.hand);
  renderEnemyHand(enemyHandSize);
  renderEmBattlefield(enemySideOfBattlefield);
  clearBattlefield();
  renderMyBattlefield(mySideOfBattlefield);
}


function renderHand(hand){
  document.getElementById("myhandwrapper").innerHTML = "";
  for(i = 0; hand.length > i; i++) {
    document.getElementById("myhandwrapper").innerHTML += getCardString(hand[i].name, hand[i].attack, hand[i].health, "images/" + hand[i].name + ".png",((i*100)+30) + "px",30 + "px","m" + i);
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
      document.getElementById("game").innerHTML += getCardString(cards[i].name, cards[i].attack, cards[i].health,"",((i*121)+1) + "px","1px","eb" +i);
    }
    else {
      document.getElementById("game").innerHTML += "";
    }
  }
}

function renderMyBattlefield(cards) {
  for(i = 0; cards.length > i; i++) {
    if(cards[i] != null) {
      document.getElementById("game").innerHTML += getCardString(cards[i].name, cards[i].attack, cards[i].health,"",((i*121)+1) + "px","162px","mb" +i);
    }
    else {
      document.getElementById("game").innerHTML += "";
    }
  }
}

function clearBattlefield(){

}

function clearMyBattlefield(){
  document.getElementById("game").innerHTML = "<table id='bfoutlines'><tr><td id='g0'> </td><td id='g1'> </td><td id='g2'> </td><td id='g3'> </td></tr><tr><td id='g4'> </td><td id='g5'> </td><td id='g6'> </td><td id='g7'> </td></tr></table>";
}
