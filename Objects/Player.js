const Ships = require('./Ships.js');
const Game = require('./Game.js');
const stringBank = require('../strings.js').stringBank;

const Player = function(name) {
  this.name = name;
  this.ships = new Ships(name);
  this.privateBoard = null;
  this.publicBoard = null;
  this.isFinishedPlacing = false;
};

// Make an object with coordinate pairs as keys and 'oo' as values. Two copies, a public and private, 
// will be made of this object. The private copy records the player's ship placements, the public copy
// records the player's attack progress on the enemy's private board (and vice versa).
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

// The board objects are not formatted for display. This takes the board data and prints it in a 10 x 10 grid, 
// with numbers labeling the axes, and the values from the board object in the grid cells. Essentially, createBlankBoards
// creates the models, this creates the views. 
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

// Take the ship the player is currently placing and the inputted placement data, and updates the desired private board
// cells to now show the first two letters (upper case) of the ship's name. 
Player.prototype.placeShip = function(shipName, placementData) {
  placementData = placementData.split(' ');
  var dir = placementData[1];
  var shipLen = this.ships[shipName].length;
  var shipSymbol = this.ships[shipName].symbol;
  var coords = placementData[0].split(',');
  var row = parseInt(coords[0]);
  var col = parseInt(coords[1]);
  var placedCoords = [];

  // Each ship will update the board at shipLen number of cells. Which cells are updated depends on the direction 
  // the user inputted, here stored in dir. Invalid placements will be caught as a false return from movePlacement. 
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
  // As long as none of the placements are invalid, return true. 
  return true;
  // Update the place on the private board with the ship's symbol. If invalid placements occur because of going out of
  // bounds or overlapping with another ship, the board is reset, and false is returned. Otherwise, true is returned. 
  function movePlacement(board, coords, rowOrCol, increment) {
    // Detect overlap with other placed ships.
    if (board[coords] !== 'oo') {
      process.stdout.write(stringBank.ERROR_OVERLAP);
      resetPlacements(board);
      return false;
    } else {
      // Keep track of which coordinates have been updated, in case the board needs to be reset at these points.
      placedCoords.push(coords);
      // Update the board with the ship's symbol.
      board[coords] = shipSymbol;
      // Move the placement coordinates by row or column, to the right or left, depending on what the player has inputted. 
      rowOrCol === 'row' ? row += increment : col += increment;
      // Detect placements moving out of bounds. 
      if (!Game.prototype.isInBounds([row, col])) {
        resetPlacements(board);
        return false;
      }
      // Return true if no issues arose with placement. 
      return true; 
    }
  }
  // If an error with placement is detected, reset the previous placements back to 'oo'. 
  function resetPlacements(board) {
    for (var i = 0; i < placedCoords.length; i++) {
      board[placedCoords[i]] = 'oo';
    }
  }
};

module.exports = Player;