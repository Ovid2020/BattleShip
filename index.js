
//process.stdin.resume();
// process.stdin.on('data', function(data) { process.stdout.write(data) });


// 1. User board creation: assign ships. 

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