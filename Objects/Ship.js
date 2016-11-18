const Ship = function(name, length, playerName) {
  this.name = name;
  this.playerName = playerName;
  this.symbol = name.slice(0, 2).toUpperCase();
  this.length = length;
  this.hits = 0;
  this.status = 'unplaced';
};

// If the attacking player attacks a place in the enemy player's private board where a ship exists, then that
// ship records a hit. If the number of hits reach the length of the ship, it sinks, and is recorded as 'dead'.
Ship.prototype.recordHit = function() {
  this.hits++;
  if (this.hits === this.length) {
    this.updateStatus('dead');
    //process.stdout.write('\nWHOA! ' + this.playerName + '\'s ' + this.name + ' has been sunk!\n');
  }
};

// Update the ship's status. 
Ship.prototype.updateStatus = function(newStatus) {
  this.status = newStatus;
};

module.exports = Ship;