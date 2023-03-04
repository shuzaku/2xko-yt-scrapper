var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  Name: {
    type: String,
    required: '{PATH} is required!'
  },
  ImageUrl: {
    type: String
  },
  Slug: {
    type: String
  },
  MatchupAppearance: {
    type: Number
  }
}, {
  timestamps: true, 
});

var Players = mongoose.model("Players", PlayerSchema);

module.exports = Players; 