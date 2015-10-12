module.exports = {
  ledger: {},
  addUser: function(userId,socket){
    this.ledger[userId]=socket;
  },
  getSocket: function(userId){
    return this.ledger[userId];
  },
  removeUser: function(userId){
    delete this.ledger[userId];
  }
};