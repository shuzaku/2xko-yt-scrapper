var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TournamentsSchema = new Schema({
  Name: {
    type: String,
    required: '{PATH} is required!'
  },
  GameIds: {
    type: Array,
  },
  LogoUrl: {
    type: String
  },
  Date: {
    type: String
  }
}, {
  timestamps: true, 
});

var Tournaments = mongoose.model("Tournaments", TournamentsSchema);

module.exports = Tournaments; 