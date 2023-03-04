var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var CharacterMatchupSchema = new Schema({
  CharacterId: {
    type: ObjectId
  },
  OpposingCharacterId: {
    type: ObjectId
  },
  Title: {
    type: String
  },
  Class: {
    type: String,
  },
  Value: {
    type: String,
  },
}, {
  timestamps: true, 
});

var CharacterMatchup = mongoose.model("Character-Matchup", CharacterMatchupSchema);

module.exports = CharacterMatchup; 