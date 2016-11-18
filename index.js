const stringBank = {
  TITLE: '       *         *                 *\n'+
         '   *                     *                    *\n'+
         '*                   *             *       *\n\n\n\n' +
         '      ||             \n' +
         '     ||||            \n' +     
         '___...||..._________ \n' +
         '  o   o   o   o   /       Welcome to CLI Battleship! \n' + 
         '^~^^~^~^~^^~^~^~^^~^~^^~^~^~^^~~^^~^~^^~~~^^~~~~^~~~~~^~~~~^ \n\nPlayer one, enter your name: ',
  ERROR_BOUNDARY: '\nThe coordinates you entered are out of bounds. Make sure both row and column are between 1 and 10.\nTry again:',
  ERROR_OVERLAP: '\nThis placement overlaps with another of your ships.\nTry again: ',
  ERROR_FORMATTING: '\nYour entry is improperly formatted. An example of a valid format is: 1,1 down\nTry again: ',
  ERROR_DIRECTION: '\nYou entered an invalid direction. Enter left, right, up, or down.\nTry again: ',
  ERROR_ALREADY_ATTACKED: '\nYou\'ve already attacked that spot.\nTry again: ',
  ALERT_HIT: '\nIT\'S A HIT!\n',
  ALERT_MISS: '\nIt\'s a miss.\n', 
  PROMPT_NAME_TWO: '\nPlayer two, enter your name: '
};

const customStrings = {
  PUBLIC_BOARD: function(yourPublicBoard) {
    return '\nAfter this turn, your board is: \n' + Player.prototype.printBoard(yourPublicBoard) + '\n\n';
  },
  BOARD_WITH_HOWTO: function (player, shouldPrintFooter) {
    return 'Your current board is:\n' + player.printBoard(player.privateBoard) + (shouldPrintFooter ? 
    '\nNote: oo indicates open spots, letters indicate a ship is placed there.\n\n' + 
    'Your remaining ships to place are:\n ' + player.ships.printShipList() + '\n' + 
    'Which ship do you want to place?\nEnter its name (not case sensitive): '
    : '');
  },
  PLAYER_ONE_PLACEMENT: function (player) {
    return '\x1B[2J\n' + player.getName() + ', begin your ship placements. ' + customStrings.BOARD_WITH_HOWTO(player, true);
  },
  INVALID_SHIP_NAME: function (shipList) {
    return '\nThat is an invalid ship name. Please select your ship from the following options:\n ' + shipList.printShipList();
  },
  PROMPT_COORD: function (data) {
    return '\nChoose a starting coordinate point and direction for placing your ' + data + 
           '.\nExample: 1,1 down or 4,4 right (note that it must stay in bounds). \nEnter here: ';
  }, 
  PROMPT_NEXT_PLACEMENT: function (shipToPlace, player, shipList) {
    return '\nOk, your ' + shipToPlace + ' is now placed. ' + customStrings.BOARD_WITH_HOWTO(player, shipList.numOfShips > 0);
  },
  PLAYER_TWO_PLACEMENT: function (playerOne, playerTwo) {
    return '\x1B[2J\n' + playerOne.getName() + ' is finished placing ships. ' + playerTwo.getName() + 
           ', begin picking ships: \n' + customStrings.BOARD_WITH_HOWTO(playerTwo, true);
  }, 
  BEGIN_BATTLE: function (playerOne) {
    return '\x1B[2J\n ~~~~~ BEGIN THE BATTLE ~~~~~ \n\nShip placement is over! Now, the game begins.\n' + playerOne.getName() + 
           ' has the first move. All the enemy ships hidden are hidden on this board:\n' + 
            playerOne.printBoard(playerOne.publicBoard) + 
            '\nNote: oo shows unattacked spots, -- shows misses, XX shows hits\n\nAttack by entering a row,column pair: ';
  }, 
  PROMPT_NEXT_ATTACK: function (player) {
    return '\n' + player.getName() + ', it\'s now your turn.' + player.printBoard(player.publicBoard) + 
            '\nNote: oo shows unattacked spots, -- shows misses, XX shows hits):\n\nAttack by entering a row,column pair: '
  },
  GAME_OVER: function (player) {
    return '\n\n ~*~*~*~* GAME OVER *~*~*~*~\n' + player.getName() + ' has won the battle!!\n\n\n';
  }
};




const Ships = function(playerName) {
  this.carrier = new Ship('carrier', 5, playerName);
  this.battleship = new Ship('battleship', 4, playerName);  
  this.cruiser = new Ship('cruiser', 3, playerName);
  this.submarine = new Ship('submarine', 3, playerName);  
  this.destroyer = new Ship('destroyer', 2, playerName);
  this.numOfShips = 5;
  this.numOfSunkenShips = 0;
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

const Ship = function(name, length, playerName) {
  this.name = name;
  this.playerName = playerName;
  this.symbol = name.slice(0, 2).toUpperCase();
  this.length = length;
  this.hits = 0;
  this.status = 'unplaced';
};

Ship.prototype.recordHit = function() {
  this.hits++;
  if (this.hits === this.length) {
    this.updateStatus('dead');
    //process.stdout.write('\nWHOA! ' + this.playerName + '\'s ' + this.name + ' has been sunk!\n');
  }
};

Ship.prototype.updateStatus = function(newStatus) {
  this.status = newStatus;
};


const Player = function(name) {
  this.name = name;
  this.ships = new Ships(name);
  //this.placedShips = {};
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
  var shipLen = this.ships[shipName].length;
  var shipSymbol = this.ships[shipName].symbol;
  var coords = placementData[0].split(',');
  var row = parseInt(coords[0]);
  var col = parseInt(coords[1]);
  var placedCoords = [];

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
  }

  return true;

  function movePlacement(board, coords, rowOrCol, direction) {
    if (board[coords] !== 'oo') {
      process.stdout.write(stringBank.ERROR_OVERLAP);
      resetPlacements(board);
      return false;
    } else {
      placedCoords.push(coords);
      board[coords] = shipSymbol;
      rowOrCol === 'row' ? row += direction : col += direction;
      if (row < 1 || row > 10 || col < 1 || col > 10) {
        process.stdout.write(stringBank.ERROR_BOUNDARY);
        resetPlacements(board);
        return false;
      }
      return true; 
    }
  }

  function resetPlacements(board) {
    for (var i = 0; i < placedCoords.length; i++) {
      board[placedCoords[i]] = 'oo';
    }
  }
};

function isValidPlacementData(placementData) {
  placementData = placementData.split(' ');
  var coords = placementData[0].split(',');
  var validDirections = ['left', 'right', 'down', 'up'];
  if (placementData.length !== 2) {
    process.stdout.write(stringBank.ERROR_FORMATTING);
    return false;
  }  
  if (!isInBounds(coords)) {
    return false;
  }
  if (validDirections.indexOf(placementData[1]) === -1) {
    process.stdout.write(stringBank.ERROR_DIRECTION);
    return false;
  }
  return true;
};

function checkAttackCoords(coords, enemy, yourPublicBoard) {
  if (!isInBounds(coords.split(','))) {
    return false;
  } 
  if (yourPublicBoard[coords] !== 'oo') {
    process.stdout.write(stringBank.ERROR_ALREADY_ATTACKED);
    return false;
  }

  if (enemy.privateBoard[coords] !== 'oo'){
    process.stdout.write(stringBank.ALERT_HIT);
    yourPublicBoard[coords] = 'XX';
    var shipName;
    switch (enemy.privateBoard[coords]) {
      case 'CA':
        shipName = 'carrier';
        break;
      case 'BA':
        shipName = 'battleship';
        break; 
      case 'CR':
        shipName = 'cruiser';
        break;  
      case 'SU':
        shipName = 'submarine';
        break;  
      case 'DE':
        shipName = 'destroyer';
        break;   
    }
    enemy.ships[shipName].recordHit();
    if (enemy.ships[shipName].status === 'dead' ) {
      enemy.ships.numOfSunkenShips++;
    }
  } else {
    process.stdout.write(stringBank.ALERT_MISS);
    yourPublicBoard[coords] = '--';

  }

  process.stdout.write(customStrings.PUBLIC_BOARD(yourPublicBoard));
  return true;
};

function isInBounds(coords) {
  if (parseInt(coords[0]) > 10 || parseInt(coords[0]) < 1 || 
    parseInt(coords[1]) > 10 || parseInt(coords[1]) < 1) {
    process.stdout.write(stringBank.ERROR_BOUNDARY);
    return false;
  } 
  return true;
};

var playerOne = new Player();
playerOne.createBlankBoards();
var playerTwo = new Player();
playerTwo.createBlankBoards();

var placementPhase = 'picking ship';
var attackPhase = 'intro';
var shipToPlace;
var attackingPlayer;

process.stdout.write(stringBank.TITLE);                     
process.stdin.on('data', function(data) { 

  // The slice is needed to get rid of the trailing newline character from the stdin data
  data = data.toString().slice(0, data.length - 1).trim();

  // The first step in the game is to assign the player's names. This goes in order of player one, 
  // then player two, and ends with a prompt to begin ship placement for player one. 
  if (!playerOne.name || !playerTwo.name) {
    if (!playerOne.getName()) {
      playerOne.setName(data);
      process.stdout.write(stringBank.PROMPT_NAME_TWO);
    } else {
      playerTwo.setName(data);
      process.stdout.write(customStrings.PLAYER_ONE_PLACEMENT(playerOne));
    }
  } 

  else if (!playerOne.isFinishedPlacing || !playerTwo.isFinishedPlacing) {
    player = !playerOne.isFinishedPlacing ? playerOne : playerTwo;
    var shipList = player.ships;

    if (placementPhase === 'picking ship') {
      if (!shipList[data.toLowerCase()]) {
        process.stdout.write(customStrings.INVALID_SHIP_NAME(shipList));
      } else {
        shipToPlace = data.toLowerCase();
        process.stdout.write(customStrings.PROMPT_COORD(data));
        placementPhase = 'placing ship';
      } 
    } else if (placementPhase === 'placing ship' && isValidPlacementData(data)) {
      if (player.placeShip(shipToPlace, data)) {
        delete shipList[shipToPlace];
        shipList.numOfShips--;
        process.stdout.write(customStrings.PROMPT_NEXT_PLACEMENT(shipToPlace, player, shipList));  
        shipToPlace = null;
        placementPhase = 'picking ship';
      }
    }

    if (shipList.numOfShips === 0) {
      if (player === playerOne) {
        playerOne.isFinishedPlacing = true;
        placementPhase = 'picking ship';
        process.stdout.write(customStrings.PLAYER_TWO_PLACEMENT(playerOne, playerTwo));
      } else {
        playerTwo.isFinishedPlacing = true;
        placementPhase = 'finished placing';
        attackingPlayer = 'player one';
        // Give the players new ships for the attack rounds.
        playerOne.ships = new Ships(playerOne.getName());
        playerTwo.ships = new Ships(playerTwo.getName());
      }
    }
  }

  if (playerOne.isFinishedPlacing && playerTwo.isFinishedPlacing) {
    if (attackPhase === 'intro') {
      process.stdout.write(customStrings.BEGIN_BATTLE(playerOne));
      attackPhase = 'attacking';
    }
    else if (attackPhase === 'attacking') {
      if (attackingPlayer === 'player one') {
        if (checkAttackCoords(data, playerTwo, playerOne.publicBoard)) {
          if (playerTwo.ships.numOfSunkenShips === playerTwo.ships.numOfShips) {
            process.stdout.write(customStrings.GAME_OVER(playerOne));
          } else {
            setTimeout(function(){
              attackingPlayer = 'player two';
              process.stdout.write(customStrings.PROMPT_NEXT_ATTACK(playerTwo));   
            }, 2500);
          }
        }  
      } else if (attackingPlayer === 'player two') {
        if (checkAttackCoords(data, playerOne, playerTwo.publicBoard)) {
          if (playerOne.ships.numOfSunkenShips === playerOne.ships.numOfShips) {
            process.stdout.write(customStrings.GAME_OVER(playerTwo));
          } else {
            setTimeout(function(){
              attackingPlayer = 'player one';
              process.stdout.write(customStrings.PROMPT_NEXT_ATTACK(playerOne));
            }, 2500);
          }
        }    
      }
    }
  }

});
