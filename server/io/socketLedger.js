module.exports = {
  ledger: {},
  addUser: function(userId,socket){
    this.ledger[userId]=socket;
    console.log(this.ledger);
  },
  getSocket: function(userId){
    return this.ledger[userId];
  },
  removeUser: function(userId){
    delete this.ledger[userId];
    console.log(this.ledger);
  }
};