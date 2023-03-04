var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
  DisplayName: {
    type: String,
    required: '{PATH} is required!'
  },
  Email: {
    type: String,
    required: '{PATH} is required!'
  },
  IsEmailVerified: {
    type: Boolean
  },
  AccountType: {
    type: String
  },
  Uid: {
    type: String
  },
  FavoriteVideos: {
    type: Array
  },
  Collections: {
    type: Array
  },
  FollowedPlayers: {
    type: Array
  },
  FollowedCharacters: {
    type: Array
  },
  FollowedGames: {
    type: Array
  }
}, {
  timestamps: true, 
});

var Accounts = mongoose.model("Accounts", AccountSchema);

module.exports = Accounts; 