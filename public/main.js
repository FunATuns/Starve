var socket = io.connect("http://141.126.155.58:7777");

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
    players = [],
    buildings = [];

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

switchPages("Match");

socket.on("You'reIn", function(player){
  switchPages("Wait");
  myplayer = player;
});



document.onkeypress = function (evt) {
  console.log(evt.charCode);
}