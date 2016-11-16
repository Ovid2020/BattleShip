
// process.stdin.resume();
// process.stdin.on('data', function(data) { process.stdout.write(data) });

// 1. Set up steps -- consider conversion to OOP design

const Ship = function(name, length) {
  this.name = name;
  this.symbol = name.slice(0, 2);
  this.length = length;
  this.coordinates = {};
  this.hits = 0;
  this.status = 'unplaced';
};

Ship.prototype.assignCoordinates = function(coordinates) {
  this.coordinates = coordinates;
}

Ship.prototype.recordHit = function() {
  this.hits++;
  if (this.hits === this.length) {
    this.updateStatus('dead');
  }
};

Ship.prototype.updateStatus = function(newStatus) {
  this.status = newStatus;
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
  this.privateBoard = null;
  this.publicBoard = null;
};

Player.prototype.createBlankBoards = function(){
  var board = {};
  for (var i = 1; i <= 10; i++) {
    for (var j = 1; j <= 10; j++) {
      board[i + "," + j] = 'o';
    }
  }
  this.privateBoard = Object.assign({}, board);
  this.publicBoard = Object.assign({}, board);
};

Player.prototype.printBoard = function(){
  var printString = '\n' + this.name + '\'s board: \n';
  var counter = 0;
  for (var key in this.publicBoard) {
    printString += this.publicBoard[key] + ' ';
    counter++;
    if (counter === 10) {
      printString += '\n';
      counter = 0;
    }
  }
  return printString;
};



// // 2. User board customizatoin: both players assign ships. 
// process.stdout.write("Player One: Assign your ships.");
// process.stdin.on('data', function(data) { process.stdout.write(data) });

// // 3. Gameplay functions: Hit, Miss, Already Taken, Sunk, Win

var vin = new Player('Vincent');
vin.createBlankBoards();
console.log(vin.printBoard());