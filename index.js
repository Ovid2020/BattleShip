
//process.stdin.resume();
// process.stdin.on('data', function(data) { process.stdout.write(data) });

// 1. Set up steps -- consider conversion to OOP design

const ships = {
  carrier: 5, 
  battleship: 4, 
  cruiser: 3, 
  submarine: 3, 
  destroyer: 2
};

const createBlankBoard = function(){
  var board = [];
  for (var i = 0; i < 10; i++) {
    board.push(new Array(10));
  }
  return board;
};

console.log(createBlankBoard());


// 2. User board customizatoin: both players assign ships. 



// 3. Gameplay functions: Hit, Miss, Already Taken, Sunk, Win