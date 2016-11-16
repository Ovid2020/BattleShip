
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
  this.numOfShips = 5;
};

Ships.prototype.printShipList = function() {
  var printString = '';
  for (var key in this) {
    if (this[key].constructor === Ship) {
      // This fixes a formatting error, where the first entry would be offset by one space.
      if (printString.length) {
        printString += ' ';
      }
      printString += key + ' (length: ' + this[key].length + ') '+ '\n';
    }
  }
  return printString;
};

const Player = function(name) {
  this.name = name || null,
  this.unPlacedShips = new Ships();
  this.placedShips = {};
  this.privateBoard = null;
  this.publicBoard = null;
  this.isFinishedPlacing = false;
};

Player.prototype.setName = function(name) {
  this.name = name;
};

Player.prototype.getName = function() {
  return this.name;
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

// var vin = new Player('Vincent');
// vin.createBlankBoards();

var playerOne = new Player();
playerOne.createBlankBoards();
var playerTwo = new Player();
playerTwo.createBlankBoards();

process.stdout.write("Welcome to CLI Battleship! \n\n Player one, enter your name: ");

process.stdin.on('data', function(data) { 

  // The slice is needed to get rid of the trailing newline character from the stdin data
  data = data.slice(0, data.length - 1)

  // The first step in the game is to assign the player's names. This goes in order of player one, 
  // then player two, and ends with a prompt to begin ship placement for player one. 
  if (!playerOne.name || !playerTwo.name) {

    !playerOne.getName() ? (playerOne.setName(data), 
                            process.stdout.write('\n Player two, enter your name: ') )
                         : (playerTwo.setName(data), 
                            process.stdout.write('\n ' + playerOne.getName() + ', begin your ship placements. ' + 
                            'Your options are:\n ' + playerOne.unPlacedShips.printShipList()));

  } 

  else if (!playerOne.isFinishedPlacing || !playerTwo.isFinishedPlacing) {

    player = !playerOne.isFinishedPlacing ? playerOne : playerTwo;
    var privateBoard = player.privateBoard;
    var shipList = player.unPlacedShips;
    var placedShipList = player.placedShips;

    if (!shipList[data]) {
      process.stdout.write('\n That is an invalid ship name. Please select your ship from the following options:\n ' 
                           + shipList.printShipList());
    }

    if (placedShipList[data]){
      process.stdout.write('\n You have already placed this ship. Would you like to move it? Type move if so.') 
    }

    if (data === 'move') {

    }

    if (shipList.numOfShips === 0) {
      player === playerOne ? (process.stdout.write('\n ' + playerTwo.getName() ', begin placing ships: \n'))
                           : (process.stdout.write('\nShip placement is over! Now, the game begins.\n' +
                              playerOne.getName() + ' has the first move. Make an attack by entering a coordinate ' +
                              'pair in the following format: 1,1 . This example attachs the position at row 1, column ' + 
                              'one.\n'

    }

  }


});

// process.stdin.resume();

// process.stdout.write("Player Two: Assign your ships.");
// process.stdin.on('data', function(data) { process.stdout.write(data); process.exit(); });

// console.log(vin.printBoard());