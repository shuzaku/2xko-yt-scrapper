var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
  Name: {
    type: String,
    required: '{PATH} is required!'
  },
  ImageUrl: {
    type: String
  },
  AvatarUrl: {
    type: String
  },
  GameId: {
    type: String,
    required: '{PATH} is required!'
  }
}, {
  timestamps: true, 
});

var Characters = mongoose.model("Characters", CharacterSchema);

module.exports = Characters; 