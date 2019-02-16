
function renderAll() {
  console.log("render all");
  renderHand(myPlayer.hand);
  renderEnemyHand(enemyHandSize);
  renderEmBattlefield(enemySideOfBattlefield);
  renderMyBattlefield(mySideOfBattlefield);
}


function renderHand(hand){
  document.getElementById("myhandwrapper").innerHTML = "";
  for(i = 0; hand.length > i; i++) {
    document.getElementById("myhandwrapper").innerHTML += getCardString(hand[i].name, hand[i].attack, hand[i].health, hand[i].name + ".png",((i*100)+30) + "px",30 + "px","m" + i);
  }
}

function renderEnemyHand(amount) {
  document.getElementById("enemyhandwrapper").innerHTML = "";
  for(i = 0; amount > i; i++) {
    document.getElementById("enemyhandwrapper").innerHTML += getCardBackString(30+(100*i) + "px","","eh" + i);
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
