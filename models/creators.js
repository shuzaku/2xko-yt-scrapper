var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CreatorsSchema = new Schema({
  Name: {
    type: String,
    required: '{PATH} is required!'
  },
  LogoUrl: {
    type: String,
  },
  YoutubeUrl: {
    type: String
  },
  YoutubeId: {
    type: String
  },
  LastVideoId: {
    type: String
  }
}, {
  timestamps: true, 
});

var Creators = mongoose.model("Creators", CreatorsSchema);

module.exports = Creators; 