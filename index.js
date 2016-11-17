
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

Player.prototype.printBoard = function(board) {
  var printString = '\n';
  var counter = 0;
  for (var key in board) {
    printString += board[key] + ' ';
    counter++;
    if (counter === 10) {
      printString += '\n';
      counter = 0;
    }
  }
  return printString;
};

Player.prototype.placeShip = function(shipName, placementData) {
  placementData = placementData.split(' ');
  var dir = placementData[1];
  var shipLen = this.unPlacedShips[shipName].length;
  var shipSymbol = this.unPlacedShips[shipName].symbol;
  var coords = placementData[0].split(',');
  var row = coords[0];
  var col = coords[1];


  // function movePlacement(currentSpot, rowOrCol, direction){
  //   for (var i = 0; i < shipLen; i++) {
  //     currentSpot = shipSymbol;
  //     rowOrCol += direction;
  //   }
  // };

  if (dir === 'left') {
    for (var i = 0; i < shipLen; i++) {
      this.privateBoard[coords[0], col] = shipSymbol;
      col--;
    }
  }

  if (dir === 'right') {
    for (var i = 0; i < shipLen; i++) {
      this.privateBoard[coords[0], col] = shipSymbol;
      col++;
    }
  }

  if (dir === 'up') {
    for (var i = 0; i < shipLen; i++) {
      this.privateBoard[row, coords[1]] = shipSymbol;
      row--;
    }
  } 

  if (dir === 'down') {
    for (var i = 0; i < shipLen; i++) {
      this.privateBoard[row, coords[1]] = shipSymbol;
      row++;
    }
  }
};

function isValidPlacement(placementData) {
  return true;
};

function printBoardWithHeader(player) {
  return 'Your remaining ships to place are:\n ' + player.unPlacedShips.printShipList() + '\n' + 
  'And your current board is: ' + player.printBoard(player.privateBoard) + '\n' + 
  'Note: o indicates open spots, letters indicate a ship is placed there.\n' + 
  'First, type in the  ship\'s name that you would like to place, then hit enter.\n';
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
                            printBoardWithHeader(playerOne)));

  } 

  else if (!playerOne.isFinishedPlacing || !playerTwo.isFinishedPlacing) {

    player = !playerOne.isFinishedPlacing ? playerOne : playerTwo;
    var privateBoard = player.privateBoard;
    var shipList = player.unPlacedShips;
    var placedShipList = player.placedShips;
    var shipToPlace;
    var shipCoordinateStart;
    var shipToMove;

    if (shipList[data]) {
      shipToPlace = data;
      process.stdout.write('\n Where would you like to place your ' + data + '? ' + 
                           'Enter a coordinate pair in the format row,column direction. For example, 1,1 down ' +
                           'indicates you wish to begin your placement at row 1, column 1, and you want the ship ' + 
                           ' to go vertically downward. Valid directions are left, right, up, and down.');  
    }

    if (isValidPlacement(data)) {
      player.placeShip(shipToPlace, data);
      placedShipList[shipToPlace] = shipList[shipToPlace];
      delete shipList[shipToPlace];
      process.stdout.write('\n Ok, your ' + shipToPlace + ' is now placed. ' + printBoardWithHeader(playerOne));  
      shipToPlace = null;
    }

    if (!shipList[data]) {
      process.stdout.write('\n That is an invalid ship name. Please select your ship from the following options:\n ' 
                           + shipList.printShipList());
    }

    if (placedShipList[data]){
      shipToMove = data;
      process.stdout.write('\n You have already placed this ship. Would you like to move it? Type move if so.') 
    }

    if (data === 'move') {

    }

    if (shipList.numOfShips === 0) {
      player === playerOne ? (process.stdout.write('\n ' + playerTwo.getName() + ', begin placing ships: \n' 
                            + printBoardWithHeader(playerTwo)))
                           : (process.stdout.write('\nShip placement is over! Now, the game begins.\n' +
                              playerOne.getName() + ' has the first move. Make an attack by entering a coordinate ' +
                              'pair in the following format: 1,1 . This example attachs the position at row 1, column ' + 
                              'one.\n'));

    }

  }


});

// process.stdin.resume();

// process.stdout.write("Player Two: Assign your ships.");
// process.stdin.on('data', function(data) { process.stdout.write(data); process.exit(); });

// console.log(vin.printBoard());