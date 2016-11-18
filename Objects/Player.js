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
      if (!Game.prototype.isInBounds([row, col])) {
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

module.exports = Player;