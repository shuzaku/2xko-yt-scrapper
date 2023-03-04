var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var VideoSchema = new Schema({
    Url: {
      type: String,
      required: '{PATH} is required!'
    },
    ContentType: {
      type: String
    },
    ContentCreatorId: {
      type: ObjectId
    },
    VideoType: {
      type: String
    },
    StartTime: {
      type: String
    },
    EndTime: {
      type: String
    },
    GameId: {
      type: ObjectId
    },
    Combos: {
      type: Array
    },
    Player1Id: {
      type: ObjectId
    },
    Player2Id: {
      type: ObjectId
    },
    Player1CharacterId: {
      type: ObjectId
    },
    Player2CharacterId: {
      type: ObjectId
    },
    Player1Character2Id: {
      type: ObjectId
    },
    Player2Character2Id: {
      type: ObjectId
    },
    Player1Character3Id: {
      type: ObjectId
    },
    Player2Character3Id: {
      type: ObjectId
    },
    WinnerId: {
      type: ObjectId
    },
    Tags: {
      type: Array
    },
    SubmittedBy: {
      type: ObjectId
    },
    UpdatedBy: {
      type: ObjectId
    }
  }, {
  timestamps: true, 
  });

var Videos = mongoose.model("Videos", VideoSchema);

module.exports = Videos; 