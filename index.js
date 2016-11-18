const Player = require('./Objects/Player.js');
const Ships = require('./Objects/Ships.js');
const Game = require('./Objects/Game.js');
const customStrings = require('./strings.js').customStrings;
const stringBank = require('./strings.js').stringBank;

const game = new Game();
game.playerOne = new Player();
game.playerOne.createBlankBoards();
game.playerTwo = new Player();
game.playerTwo.createBlankBoards();

process.stdout.write(stringBank.TITLE);                     
process.stdin.on('data', function(data) { 

  // The slice is needed to get rid of the trailing newline character from the stdin data
  data = data.toString().slice(0, data.length - 1).trim();

  // The first step in the game is to assign the player's names. This goes in order of player one, 
  // then player two, and ends with a prompt to begin ship placement for player one. 
  if (!game.playerOne.name || !game.playerTwo.name) {
    if (!game.playerOne.getName()) {
      game.playerOne.setName(data);
      process.stdout.write(stringBank.PROMPT_NAME_TWO);
    } else {
      game.playerTwo.setName(data);
      process.stdout.write(customStrings.PLAYER_ONE_PLACEMENT(game.playerOne));
    }
  } else if (!game.playerOne.isFinishedPlacing || !game.playerTwo.isFinishedPlacing) {
    player = !game.playerOne.isFinishedPlacing ? game.playerOne : game.playerTwo;
    var shipList = player.ships;
    if (game.placementPhase === 'picking ship') {
      if (!shipList[data.toLowerCase()]) {
        process.stdout.write(customStrings.INVALID_SHIP_NAME(shipList));
      } else {
        game.shipToPlace = data.toLowerCase();
        process.stdout.write(customStrings.PROMPT_COORD(data));
        game.placementPhase = 'placing ship';
      } 
    } else if (game.placementPhase === 'placing ship' && game.isValidPlacementData(data)) {
      if (player.placeShip(game.shipToPlace, data)) {
        delete shipList[game.shipToPlace];
        shipList.numOfShips--;
        process.stdout.write(customStrings.PROMPT_NEXT_PLACEMENT(game.shipToPlace, player, shipList));  
        game.shipToPlace = null;
        game.placementPhase = 'picking ship';
      }
    }

    if (shipList.numOfShips === 0) {
      if (player === game.playerOne) {
        game.playerOne.isFinishedPlacing = true;
        game.placementPhase = 'picking ship';
        process.stdout.write(customStrings.PLAYER_TWO_PLACEMENT(game.playerOne, game.playerTwo));
      } else {
        game.playerTwo.isFinishedPlacing = true;
        game.placementPhase = 'finished placing';
        game.attackingPlayer = 'player one';
        // Give the players new ships for the attack rounds.
        game.playerOne.ships = new Ships(game.playerOne.getName());
        game.playerTwo.ships = new Ships(game.playerTwo.getName());
      }
    }
  }

  if (game.playerOne.isFinishedPlacing && game.playerTwo.isFinishedPlacing) {
    if (game.attackPhase === 'intro') {
      process.stdout.write(customStrings.BEGIN_BATTLE(game.playerOne));
      game.attackPhase = 'attacking';
    }
    else if (game.attackPhase === 'attacking') {
      game.attackingPlayer === 'player one' ? game.attackSequence(data, game.playerTwo, game.playerOne) : 
                                              game.attackSequence(data, game.playerOne, game.playerTwo);
    }
  }
});

