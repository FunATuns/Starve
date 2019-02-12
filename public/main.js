var socket = io.connect("http://192.168.1.130:7777");

socket.emit('Joined',null);

var loginPage = document.getElementById("Login"),
<<<<<<< HEAD
    gamePage = document.getElementById("Game"),
    animate = false,
    started = false,
    terrain,
    units,
=======
    gamePage = document.getElementById("slidecontent"),
    navBar = document.getElementById("files"),
    players = [],
    orders = [],
    pot = {},
    potTotal = 0,
>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7
    myPlayer = {},
    players = [],
    buildings = [];
  
setInterval(function () {
  animate = !animate;
},1000);

function start () {
 var name = document.getElementById("name").value;
 socket.emit('Starting',name);
}

socket.on("You'reIn", function(player, lastSpins){
  loginPage.style.display = "none";
<<<<<<< HEAD
  gamePage.style.display = "inline-block";
  started = true;
  myPlayer = player;
});

=======
  gamePage.style.display = "block";
  navBar.style.display = "block";
  myplayer = player;
  lastSpin = Date.now() - lastSpins;
});

socket.on('CurrentCasino', function(data){
  pot = data.pot;
  potTotal = data.total;
  myPlayer = data.myPlayer;
  players = data.players;
  document.getElementById("bigwin").innerHTML = getPercent(myPlayer.username);
  document.getElementById("biglose").innerHTML = "lol kys";
  document.getElementById("ammountyouhave").innerHTML = "You have $" + myPlayer.money;
  document.getElementById("curramount").innerHTML = "Your pot contribution: $" + getMoneyInPot(myPlayer.username);
  generatePotList();
});

socket.on('CurrentDrugs', function(data){
  orders = data.orders;
  myPlayer = data.myPlayer;
  players = data.players;
  generateOrdersList();
});

function betMore () {
  socket.emit('BetMore',"");
}

function betLess () {
  socket.emit('BetLess',"");
}
>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7

socket.on('Rip', function(cid){
  for(var i in players) {
    if(players[i].cid = cid) {
      players.splice(i, 1);
    }
  }
});

function setup() {
  var canvas = createCanvas(715,585);
  canvas.parent("drawField");
  terrain = loadImage('images/terrainScale.png');
  units = loadImage('images/unitsScale.png');
  background(0,0,0);
}
  
function draw() {
  if(started) {
    var offsetX = myPlayer.x - 5;
    var offsetY = myPlayer.y - 4;
    for(var i = 0; i < 9; i++) {
      for(var j = 0; j < 11; j++) {
        var tile = getTileByCoordinate(offsetX + j , offsetY + i);
        image(terrain, (j*64) + j, (i*64) + i,64,64,(tile%6) * 64, Math.floor(tile/6)*64,64,64 );
      }
    }

<<<<<<< HEAD
    if(animate) {
      image(units, 325,260, 64, 64, 0,448,64,64);
    }
    else {
      image(units, 325,260, 64, 64, 0,0,64,64);
=======
function generateOrdersList(){
  var orderList = [];
  for(i = 0; i < orders.length; i++){
    if(orders[i].ordererId != myPlayer.id) {
      orderList[i] = {
        payout: orders[i].runnerPayout,
        risk: orders[i].risk,
        id: orders[i].ordererId
      };
    }
  }

  orderList.sort(function(a, b) {
    return b.payout  - a.payout;
  });

  document.getElementById("runsHere").innerHTML = "";
  for(i = 0; i < orderList.length; i++){
    document.getElementById("runsHere").innerHTML += "<div class='runItem'>Payout: $" + orderList[i].payout + " Risk: %" + orderList[i].risk + " <button class='runButton' onclick='runOrder(" + orderList[i].id + ")'>RUN!</button></div>"
  }
}

function createOrder() {
  var fromPlaceEl = document.getElementById("fromPlace");
  var drugPlace = fromPlaceEl.options[fromPlaceEl.selectedIndex].value;

  var drugTypeEl = document.getElementById("drugType");
  var drugType = drugTypeEl.options[drugTypeEl.selectedIndex].value;

  var drugAmount = Math.floor(document.getElementById("drugsAmount").value);

  socket.emit("CreateOrder", {drugType:drugType, drugAmount:drugAmount, drugPlace:drugPlace});
}

function generatePotList(){
  for(i = 0; i < players.length; i++){
    potList[i] = {
      username: players[i].username,
      money: getMoneyInPot(players[i].username),
      percent: getPercent(players[i].username)
>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7
    }
  }
}

document.onkeypress = function (evt) {
  console.log(evt.charCode);
}


<<<<<<< HEAD
function getTileByCoordinate(x,y) {
  if(x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) 
    return 0;
  else
    return world.data[(y*mapWidth) + x] - 1;
}
=======
function genDivs(inf) {
  document.getElementById("innerSpin").innerHTML = "";
  for(i = 0; i < inf.length; i++){
    document.getElementById("innerSpin").innerHTML += "<div class='spinItem' style='background-color:" + inf[i].color + ";'>" + inf[i].username + "</div>"
  }
  spin();
}

function spin(){
  document.getElementById("innerSpin").style.opacity = "1";
  setTimeout(function(){
    document.getElementById("innerSpin").style.marginLeft = "-6000px";
  },500);
  setTimeout(function(){
    document.getElementById("innerSpin").style.opacity = "0";
    document.getElementById("innerSpin").style.marginLeft = "0px";
  },10000);
}

function focuss(slide) {
  if(slide == 1){
    $("#slidecontent").css("margin-left", '0');
    document.getElementById("file2").setAttribute("class", "");
    document.getElementById("file1").setAttribute("class", "lifocused");
  }
 if(slide == 2){
  $("#slidecontent").css("margin-left", '-100%');
  document.getElementById("file1").setAttribute("class", "");
  document.getElementById("file2").setAttribute("class", "lifocused");
  }
}

function calculateDrug() {
  var fromPlaceEl = document.getElementById("fromPlace");
  var drugPlace = fromPlaceEl.options[fromPlaceEl.selectedIndex].value;

  var drugTypeEl = document.getElementById("drugType");
  var drugType = drugTypeEl.options[drugTypeEl.selectedIndex].value;

  var drugAmount = Math.floor(document.getElementById("drugsAmount").value);

  var payout = priceFromDrug(drugType).cost;
  var risk = priceFromDrug(drugType).risk;

  payout *= drugAmount;
  risk *= drugAmount;

  payout *= multiplierFromCountry(drugPlace).cost;
  risk *= multiplierFromCountry(drugPlace).risk;

  var runnerPayout = Math.floor((payout/100)*.75) *100 ;
  var orderPayout =Math.floor((payout/100)*.25) *100;

  document.getElementById("outputDrugs").innerHTML = "Payout for you: $" + orderPayout + "<br>Payout for runner: $" + runnerPayout + "<br>Risk for runner: %" + risk.toFixed(2);

}

function priceFromDrug(drug) {
  if( drug == "weed") {
    return {cost:100, risk: .1};
  }
  else if (drug == "coke") {
    return {cost:300, risk: .5};
  }
  else if (drug == "heroin") {
    return {cost:600, risk: 1};
  }
  else if (drug == "meth") {
    return {cost:1000, risk: 2};
  }
}

function multiplierFromCountry(country) {
  if( country == "america") {
    return {cost:1, risk: 1};
  }
  else if (country == "canada") {
    return {cost:2, risk: 1.5};
  }
  else if (country == "mexico") {
    return {cost:3, risk: 4};
  }
  else if (country == "china") {
    return {cost:8, risk: 10};
  }
}
>>>>>>> f8abd4b672746e6cc13523a360e2eecad26078f7
