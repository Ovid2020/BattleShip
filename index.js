
// process.stdin.resume();
// process.stdin.on('data', function(data) { process.stdout.write(data) });

// 1. Set up steps -- consider conversion to OOP design

const Ship = function(name, length) {
  this.name = name;
  this.symbol = name.slice(0, 2);
  this.length = length;
  this.isPlaced = false;
};

const Ships = function() {
  this.carrier = new Ship('carrier', 5);
  this.battleship = new Ship('battleship', 4);  
  this.cruiser = new Ship('cruiser', 3);
  this.submarine = new Ship('submarine', 3);  
  this.destroyer = new Ship('destroyer', 2);
  this.numberSunk = 0; 
};

const Player = function(name) {
  this.name = name || 'Anonymous',
  this.ships = new Ships();
  this.board = null;
};

Player.prototype.createBlankBoard = function(){
  var board = [];
  for (var i = 0; i < 10; i++) {
    board.push(new Array(10));
  }
  this.board = board;
};



// // 2. User board customizatoin: both players assign ships. 
// process.stdout.write("Player One: Assign your ships.");
// process.stdin.on('data', function(data) { process.stdout.write(data) });

// // 3. Gameplay functions: Hit, Miss, Already Taken, Sunk, Win

var vin = new Player('Vincent');
vin.createBlankBoard();
console.log(vin);