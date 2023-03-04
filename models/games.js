var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GameSchema = new Schema({
  Title: {
    type: String,
    required: '{PATH} is required!'
  },
  LogoUrl: {
    type: String
  }
}, {
  timestamps: true, 
});

var Games = mongoose.model("Games", GameSchema);

module.exports = Games; 