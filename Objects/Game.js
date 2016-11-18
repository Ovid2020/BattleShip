const stringBank = require('../strings.js').stringBank;
const customStrings = require('../strings.js').customStrings;

const Game = function(){
  this.playerOne = null;
  this.playerTwo = null;
  this.placementState = 'picking ship';
  this.attackState = 'intro';
  this.shipToPlace = null;
  this.attackingPlayer = null;
};

// Check to make sure the placement is formatted correctly, uses a correct direction word, 
// and that all coordinates for the placement stay in bounds. 
Game.prototype.isValidPlacementData = function(placementData) {
  placementData = placementData.split(' ');
  var coords = placementData[0].split(',');
  var validDirections = ['left', 'right', 'down', 'up'];
  if (placementData.length !== 2) {
    process.stdout.write(stringBank.ERROR_PLACEMENT_FORMATTING);
    return false;
  }  
  if (!this.isInBounds(coords)) {
    return false;
  }
  if (validDirections.indexOf(placementData[1]) === -1) {
    process.stdout.write(stringBank.ERROR_DIRECTION);
    return false;
  }
  return true;
};

// Attack sequence starts with checking the attack coordinates, 
Game.prototype.attackSequence = function(data, enemy, you) {
  // Checking attack coordinates will make sure the input is valid, then update the public board according to a hit or miss. 
  if (this.checkAttackCoords(data, enemy, you.publicBoard)) {
    // This represents a winning condition for the current player (you). It prints the game over string, then prompts for a new game.
    if (enemy.ships.numOfSunkenShips === enemy.ships.numOfShips) {
      process.stdout.write(customStrings.GAME_OVER(you));
      setTimeout(function(){
        process.stdout.write(stringBank.PROMPT_NEW_GAME);
        setTimeout(function(){
          process.stdin.end();
        }, 1000);
      }, 1500);
    } else {
      // If neither player has won, the attacking player switches, and the attack sequence repeats (triggered in index.js).
      setTimeout((function(){
        this.attackingPlayer = you === this.playerOne ? 'player two' : 'player one';
        process.stdout.write(customStrings.PROMPT_NEXT_ATTACK(enemy));   
      }).bind(this), 2500);
    }
  } 
};

// Checking the attack coordinates will return false if they are out of bounds, invalidly formatted, 
// or if the point has already been attacked. Otherwise, it updates the public board for the current
// player, records any damage to enemy ships resulting from a hit, which will also update a ship to 
// be 'dead' if it has been sunk. If there weren't any input errors, it returns true. 
Game.prototype.checkAttackCoords = function(coords, enemy, yourPublicBoard) {
  // Detect if the attack is out of bounds.
  if (!this.isInBounds(coords.split(','))) {
    return false;
  }
  // Detect if the input format is invalid. 
  if (!this.isValidCoordFormat(coords)){
    return false;
  } 
  // Detect if the spot has already been attacked.
  if (yourPublicBoard[coords] !== 'oo') {
    process.stdout.write(stringBank.ERROR_ALREADY_ATTACKED);
    return false;
  }
  // Detect if the current player has hit an enemy ship, record damage to that ship, check if it has been sunk. 
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
    // If the ship has been sunk, increment the number of sunken ships for the enemy player. 
    if (enemy.ships[shipName].status === 'dead' ) {
      enemy.ships.numOfSunkenShips++;
    }
  } else {
    // This condition is a valid attack, but a miss. 
    process.stdout.write(stringBank.ALERT_MISS);
    yourPublicBoard[coords] = '--';
  }
  // Show the attacking player's board, updated after a successful attack. 
  process.stdout.write(customStrings.PUBLIC_BOARD(enemy.printBoard, yourPublicBoard));
  return true;
};

// Valid format is number,number. isInBounds will make sure the numbers are between 1 and 10, inclusive. 
Game.prototype.isValidCoordFormat = function(coords) {
  if (coords.split(',').length !== 2) {
    process.stdout.write(stringBank.ERROR_COORD_FORMATTING);
    return false;
  }
  return true;
};

// If either the row or column are not between 1 and 10 (inclusive), the attack is out of bounds. 
Game.prototype.isInBounds = function(coords) {
  if (parseInt(coords[0]) > 10 || parseInt(coords[0]) < 1 || 
    parseInt(coords[1]) > 10 || parseInt(coords[1]) < 1) {
    process.stdout.write(stringBank.ERROR_BOUNDARY);
    return false;
  } 
  return true;
};

module.exports = Game;