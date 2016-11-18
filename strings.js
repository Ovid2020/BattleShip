// Keep all the user-facing strings of the game organized in stringBank, an object containing all the constant stings, 
// and customStrings, an object containing functions which return strings customized to game states and player properties. 
const stringBank = {
  TITLE: '       *         *                 *\n'+
         '   *                     *                    *\n'+
         '*                   *             *       *\n\n\n\n' +
         '      ||             \n' +
         '     ||||            \n' +     
         '___...||..._________ \n' +
         '  o   o   o   o   /       Welcome to CLI Battleship! \n' + 
         '^~^^~^~^~^^~^~^~^^~^~^^~^~^~^^~~^^~^~^^~~~^^~~~~^~~~~~^~~~~^ \n\nPlayer one, enter your name: ',
  ERROR_BOUNDARY: '\nThe coordinates you entered are out of bounds, or your placement goes off the grid. Make sure both row and column stay between 1 and 10.\nTry again:',
  ERROR_OVERLAP: '\nThis placement overlaps with another of your ships.\nTry again: ',
  ERROR_PLACEMENT_FORMATTING: '\nYour entry is improperly formatted. An example of a valid format is: 1,1 down\nTry again: ',
  ERROR_COORD_FORMATTING: '\nYour attack is improperly formatted. An example of a valid format is: 1,1 \nTry again: ',
  ERROR_DIRECTION: '\nYou entered an invalid direction. Enter left, right, up, or down.\nTry again: ',
  ERROR_ALREADY_ATTACKED: '\nYou\'ve already attacked that spot. Try again: ',
  ALERT_HIT: '\nIT\'S A HIT!\n',
  ALERT_MISS: '\nIt\'s a miss.\n', 
  PROMPT_NAME_TWO: '\nPlayer two, enter your name: ',
  PROMPT_NEW_GAME: '\n\nTo play a new game, enter the following after the current game ends: node index\n\n'
};

const customStrings = {
  PUBLIC_BOARD: function(printFn, yourPublicBoard) {
    return '\nAfter this turn, your board is: \n' + printFn(yourPublicBoard) + '\n\n';
  },
  BOARD_WITH_HOWTO: function (player, shouldPrintFooter) {
    return 'Your current board is:\n' + player.printBoard(player.privateBoard) + (shouldPrintFooter ? 
    '\n(oo indicates open spots, letters indicate a ship is placed there)\n\n' + 
    'Your remaining ships to place are:\n ' + player.ships.printShipList() + '\n' + 
    'Which ship do you want to place?\nEnter its name (not case sensitive): '
    : '');
  },
  PLAYER_ONE_PLACEMENT: function (player) {
    return '\x1B[2J\n' + player.name + ', begin your ship placements. ' + customStrings.BOARD_WITH_HOWTO(player, true);
  },
  INVALID_SHIP_NAME: function (shipList) {
    return '\nThat is an invalid ship name. Please select your ship from the following options:\n ' + shipList.printShipList();
  },
  PROMPT_COORD: function (data) {
    return 'Where do you want to place your ' + data + '?' +
           '\nValid input format is row,column direction (example: 1,1 down). Enter here: ';
  }, 
  PROMPT_NEXT_PLACEMENT: function (shipToPlace, player, shipList) {
    return '\nOk, your ' + shipToPlace + ' is now placed. ' + customStrings.BOARD_WITH_HOWTO(player, shipList.numOfShips > 0);
  },
  PLAYER_TWO_PLACEMENT: function (playerOne, playerTwo) {
    return '\x1B[2J\n' + playerOne.name + ' is finished placing ships. ' + playerTwo.name + 
           ', begin picking ships. ' + customStrings.BOARD_WITH_HOWTO(playerTwo, true);
  }, 
  BEGIN_BATTLE: function (playerOne) {
    return '\x1B[2J\n ~~~~~ BEGIN THE BATTLE ~~~~~ \n\nShip placement is over! Now, the game begins.\n' + playerOne.name + 
           ' has the first move. All the enemy ships hidden are hidden on this board:\n' + 
            playerOne.printBoard(playerOne.publicBoard) + 
            '\n(oo shows unattacked spots, -- shows misses, XX shows hits)\n\nAttack by entering a row,column pair: ';
  }, 
  PROMPT_NEXT_ATTACK: function (player) {
    return '\n' + player.name + ', it\'s now your turn.\n' + player.printBoard(player.publicBoard) + 
            '\nNote: oo shows unattacked spots, -- shows misses, XX shows hits):\n\nAttack by entering a row,column pair: '
  },
  GAME_OVER: function (player) {
    return '\n\n ~*~*~*~* GAME OVER *~*~*~*~\n' + player.name + ' has won the battle!!\n\n\n';
  }
};

module.exports = {stringBank: stringBank, customStrings: customStrings};