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

   // 1. ASSIGN PLAYER NAMES
   // The first step in the game is to assign the player's names. This goes in order of player one, 
   // then player two, and ends with a prompt to begin ship placement for player one. 
  if (!game.playerOne.name || !game.playerTwo.name) {
    if (!game.playerOne.name) {
      game.playerOne.setName(data);
      // This prompts player two to enter name. 
      process.stdout.write(stringBank.PROMPT_NAME_TWO);
    } else {
      game.playerTwo.setName(data);
      // This prompt leads into step 2. 
      process.stdout.write(customStrings.PLAYER_ONE_PLACEMENT(game.playerOne));
    }
  } 
  // 2. PLAYERS PLACE SHIPS
  // Player one places all five ships, then player two places all five ships. 
  else if (!game.playerOne.isFinishedPlacing || !game.playerTwo.isFinishedPlacing) {
    player = !game.playerOne.isFinishedPlacing ? game.playerOne : game.playerTwo;
    var shipList = player.ships;
    // 2a. CURRENT PlAYER PICKS SHIP
    // game.placementState keeps track of the current player's placement state (picking, then placing, repeating for all 5 ships.
    if (game.placementState === 'picking ship') {
      // Catch if the player enters an incorrect ship name. If the name is correct, the ship's name is stored, to be recorded in the player's
      // private board in the placing state (see the else if block on line 55.) 
      if (!shipList[data.toLowerCase()]) {
        process.stdout.write(customStrings.INVALID_SHIP_NAME(shipList));
      } else {
        game.shipToPlace = data.toLowerCase();
        // Prompt the player for placement coordinates.
        process.stdout.write(customStrings.PROMPT_COORD(data));
        game.placementState = 'placing ship';
      } 
    } 
    // 2b. CURRENT PLAYER PLACES SHIP
    // In the placing state, validity of placement data is checked, then the current ship is recorded on the current player's private board.
    else if (game.placementState === 'placing ship' && game.isValidPlacementData(data)) {
      if (player.placeShip(game.shipToPlace, data)) {
        // If the placement succeeded, the current ship is removed from the player's ship list, and numOfShips decrements. 
        delete shipList[game.shipToPlace];
        shipList.numOfShips--;
        // Prompt the player to pick the next ship.
        process.stdout.write(customStrings.PROMPT_NEXT_PLACEMENT(game.shipToPlace, player, shipList));  
        game.shipToPlace = null;
        // Placement state is switched back to picking, so the player can choose the next ship to place. As long as there are still ships in
        // the list, the logic then returns to line 41 upon the next data input. 
        game.placementState = 'picking ship';
      }
    }
    // 2c. CURRENT PLAYER'S SHIPS ARE ALL PLACED
    // If this is player one, then player two has to place ships. If player two just finished, then the game continues to the attack state. 
    if (shipList.numOfShips === 0) {
      // If the current player is player one, record that it is finished placing, then prompt player two for placement. 
      if (player === game.playerOne) {
        game.playerOne.isFinishedPlacing = true;
        // Prompt player two to begin placement.
        process.stdout.write(customStrings.PLAYER_TWO_PLACEMENT(game.playerOne, game.playerTwo));
      // If the current player is player two, record that it is finished placing. Both players are now finished. Proceed to attack state.
      } else {
        game.playerTwo.isFinishedPlacing = true;
        game.placementState = 'finished placing';
        game.attackingPlayer = 'player one';
        // Give the players new ships for the attack rounds.
        game.playerOne.ships = new Ships(game.playerOne.name);
        game.playerTwo.ships = new Ships(game.playerTwo.name);
      }
    }
  }
  // 3. PLAYERS ATTACK
  // Once placement is finished, the players go back and forth attacking each other's public boards. Private boards are used to check 
  // if the attack hit, missed, targeted a spot that was already attacked, or sunk a ship. Public boards record and display that result.
  if (game.playerOne.isFinishedPlacing && game.playerTwo.isFinishedPlacing) {
    // Intro shows the transition from placement to attacking, then updates the attack state in game.attackState 
    if (game.attackState === 'intro') {
      // Prompt player one to make the first attack. 
      process.stdout.write(customStrings.BEGIN_BATTLE(game.playerOne));
      game.attackState = 'attacking';
    }
    else if (game.attackState === 'attacking') {
      // Attack sequence toggles back and forth between receiving attacks from player one then player two. It will check for hits, misses, 
      // ship sinking, attacking previously targeted spots, and winning conditions. It updates public boards accordingly. 
      game.attackingPlayer === 'player one' ? game.attackSequence(data, game.playerTwo, game.playerOne) : 
                                              game.attackSequence(data, game.playerOne, game.playerTwo);
    }
  }
  //4. GAME OVER AND NEW GAME
  // These are handled inside of game.attackSequence
});

