const Ship = function(name, length, playerName) {
  this.name = name;
  this.playerName = playerName;
  this.symbol = name.slice(0, 2).toUpperCase();
  this.length = length;
  this.hits = 0;
  this.status = 'unplaced';
};

Ship.prototype.recordHit = function() {
  this.hits++;
  if (this.hits === this.length) {
    this.updateStatus('dead');
    //process.stdout.write('\nWHOA! ' + this.playerName + '\'s ' + this.name + ' has been sunk!\n');
  }
};

Ship.prototype.updateStatus = function(newStatus) {
  this.status = newStatus;
};

module.exports = Ship;