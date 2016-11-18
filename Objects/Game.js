const stringBank = require('../strings.js').stringBank;
const customStrings = require('../strings.js').customStrings;

const Game = function(){
  this.playerOne = null;
  this.playerTwo = null;
  this.placementPhase = 'picking ship';
  this.attackPhase = 'intro';
  this.shipToPlace = null;
  this.attackingPlayer = null;
};

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

Game.prototype.attackSequence = function(data, enemy, you) {
  //var playerOne = this.playerOne;
  //var attackingPlayer = this.attackingPlayer
  if (this.checkAttackCoords(data, enemy, you.publicBoard)) {
    if (enemy.ships.numOfSunkenShips === enemy.ships.numOfShips) {
      process.stdout.write(customStrings.GAME_OVER(you));
    } else {
      setTimeout((function(){
        this.attackingPlayer = you === this.playerOne ? 'player two' : 'player one';
        process.stdout.write(customStrings.PROMPT_NEXT_ATTACK(enemy));   
      }).bind(this), 2500);
    }
  } 
};

Game.prototype.checkAttackCoords = function(coords, enemy, yourPublicBoard) {
  if (!this.isValidCoordFormat(coords)){
    return false;
  } 
  if (!this.isInBounds(coords.split(','))) {
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
  process.stdout.write(customStrings.PUBLIC_BOARD(enemy.printBoard, yourPublicBoard));
  return true;
};

Game.prototype.isValidCoordFormat = function(coords) {
  if (coords.split(',').length !== 2) {
    process.stdout.write(stringBank.ERROR_COORD_FORMATTING);
    return false;
  }
  return true;
};

Game.prototype.isInBounds = function(coords) {
  if (parseInt(coords[0]) > 10 || parseInt(coords[0]) < 1 || 
    parseInt(coords[1]) > 10 || parseInt(coords[1]) < 1) {
    process.stdout.write(stringBank.ERROR_BOUNDARY);
    return false;
  } 
  return true;
};

module.exports = Game;