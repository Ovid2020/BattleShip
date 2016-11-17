
// process.stdin.resume();
// process.stdin.on('data', function(data) { process.stdout.write(data) });

// 1. Set up steps -- consider conversion to OOP design

const Ship = function(name, length) {
  this.name = name;
  this.symbol = name.slice(0, 2).toUpperCase();
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
      printString += key.toUpperCase() + ' (length: ' + this[key].length + ') '+ '\n';
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
      board[i + "," + j] = 'oo';
    }
  }
  this.privateBoard = Object.assign({}, board);
  this.publicBoard = Object.assign({}, board);
};

Player.prototype.printBoard = function(board) {
  var printString = '\n    1  2  3  4  5  6  7  8  9  10\n 1  ';
  var counter = 0;
  var rowNumber = 2;     
  for (var key in board) {
    printString += board[key] + ' ';
    counter++;
    if (counter === 10) {
      printString += '\n ' + (rowNumber < 10 ? rowNumber + '  ' : rowNumber === 10 ? rowNumber + ' ' :  '');
      rowNumber++;
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
  var row = parseInt(coords[0]);
  var col = parseInt(coords[1]);
  var placedCoords = [];
  var newCoords;

  for (var i = 0; i < shipLen; i++) {
    if (dir === 'left') {
      newCoords = coords[0] + ',' + col;
      if (!movePlacement(this.privateBoard, newCoords, 'col', -1)) {
        return false;
      }
    }
    if (dir === 'right') {
      newCoords = coords[0] + ',' + col;
      if (!movePlacement(this.privateBoard, newCoords, 'col', 1)) {
        return false;
      }
    }
    if (dir === 'up') {
      newCoords = row + ',' + coords[1];
      if (!movePlacement(this.privateBoard, newCoords, 'row', -1)) {
        return false;
      }
    }
    if (dir === 'down') {
      newCoords = row + ',' + coords[1];
      if (!movePlacement(this.privateBoard, newCoords, 'row', 1)) {
        return false;
      }
    }
    if (row < 1 || row > 10 || col < 1 || col > 10) {
      process.stdout.write('\nThis placement goes out of bounds. Please enter a new placement.\n');
      return false;
    }
  }

  return true;

  function movePlacement(board, coords, rowOrCol, direction) {
    if (board[coords] !== 'oo') {
      process.stdout.write('\nThis placement overlaps with another of your ships. Please enter a new placement.\n');
      resetPlacements();
      return false;
    } else {
      placedCoords.push(coords);
      board[coords] = shipSymbol;
      rowOrCol === 'row' ? row += direction : col += direction;
      return true; 
    }
  }

  function resetPlacements() {
    placedCoords.forEach(function(coord) {
      coord = 'oo';
    });
  }
};

function isValidPlacementData(placementData) {
  placementData = placementData.split(' ');
  var coords = placementData[0].split(',');
  var validDirections = ['left', 'right', 'down', 'up'];
  if (placementData.length !== 2) {
    process.stdout.write('\nYour entry is improperly formatted. Try again. An example of a valid format is: 1,1 down\n');
    return false;
  }  
  if (parseInt(coords[0]) > 10 || parseInt(coords[0]) < 1 || 
      parseInt(coords[1]) > 10 || parseInt(coords[1]) < 1) {
    process.stdout.write('\nThe coordinates you entered are out of bounds. Make sure both row and column are between 1 and 10. Try again.\n');
    return false;
  } 
  if (validDirections.indexOf(placementData[1]) === -1) {
    process.stdout.write('\nYou entered an invalid direction. Enter left, right, up, or down. Try again.\n');
    return false;
  }
  return true;
};

function printBoardWithHeader(player) {
  return 'Your current board is:\n' + player.printBoard(player.privateBoard) +
  'Note: oo indicates open spots, letters indicate a ship is placed there.\n\n' + 
  'Your remaining ships to place are:\n ' + player.unPlacedShips.printShipList() + '\n' + 
  'Type in the ship\'s name (not case sensitive) that you would like to place, then hit enter.\n';
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

var placementPhase = 'picking ship';
var shipToPlace;
var shipCoordinateStart;
var shipToMove;


process.stdout.write('Welcome to CLI Battleship! \n\nPlayer one, enter your name: ');

process.stdin.on('data', function(data) { 

  // The slice is needed to get rid of the trailing newline character from the stdin data
  data = data.toString().slice(0, data.length - 1);

  // The first step in the game is to assign the player's names. This goes in order of player one, 
  // then player two, and ends with a prompt to begin ship placement for player one. 
  if (!playerOne.name || !playerTwo.name) {

    !playerOne.getName() ? (playerOne.setName(data), 
                            process.stdout.write('\nPlayer two, enter your name: ') )
                         : (playerTwo.setName(data), 
                            process.stdout.write('\n ' + playerOne.getName() + ', begin your ship placements. ' + 
                            printBoardWithHeader(playerOne)));

  } 

  else if (!playerOne.isFinishedPlacing || !playerTwo.isFinishedPlacing) {

    player = !playerOne.isFinishedPlacing ? playerOne : playerTwo;
    var privateBoard = player.privateBoard;
    var shipList = player.unPlacedShips;
    var placedShipList = player.placedShips;

    if (placementPhase === 'picking ship') {
      if (!shipList[data.toLowerCase()]) {
        process.stdout.write('\nThat is an invalid ship name. Please select your ship from the following options:\n ' 
                             + shipList.printShipList());
      } else {
        shipToPlace = data;
        process.stdout.write('\nChoose a starting coordinate point and direction for placing your ' + data + 
                             '.\nExample: 1,1 down or 4,4 right (note that it must stay in bounds). \n');
        placementPhase = 'placing ship';
      } 
    } else if (placementPhase === 'placing ship' && isValidPlacementData(data)) {
      if (player.placeShip(shipToPlace, data)) {
        placedShipList[shipToPlace] = shipList[shipToPlace];
        delete shipList[shipToPlace];
        shipList.numOfShips--;
        process.stdout.write('\n Ok, your ' + shipToPlace + ' is now placed. ' + printBoardWithHeader(player));  
        shipToPlace = null;
        placementPhase = 'picking ship'
      }
    }

    // if (!shipList[data]) {
    //   process.stdout.write('\n That is an invalid ship name. Please select your ship from the following options:\n ' 
    //                        + shipList.printShipList());
    // }

    // if (placedShipList[data]){
    //   shipToMove = data;
    //   process.stdout.write('\n You have already placed this ship. Would you like to move it? Type move if so.') 
    // }

    // if (data === 'move') {

    // }

    if (shipList.numOfShips === 0) {
      if (player === playerOne) {
        process.stdout.write('\n ' + playerTwo.getName() + ', begin placing ships: \n' + printBoardWithHeader(playerTwo));
        placementPhase = 'picking ship';
        playerOne.isFinishedPlacing = true;
      } else {
        (process.stdout.write('\nShip placement is over! Now, the game begins.\n' + playerOne.getName() + 
                              ' has the first move. Make an attack by entering a coordinate ' +
                              'pair in the following format: 1,1 . This example attachs the position at row 1, column ' + 
                              'one.\n'));
        placementPhase = 'finished placing';

      }
    }

  }


});

// process.stdin.resume();

// process.stdout.write("Player Two: Assign your ships.");
// process.stdin.on('data', function(data) { process.stdout.write(data); process.exit(); });

// console.log(vin.printBoard());