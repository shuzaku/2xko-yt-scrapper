var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var MoveSchema = new Schema({
  CharacterId: {
    type: ObjectId,
    required: '{PATH} is required!'
  },
  MoveName: {
    type: String,
    required: '{PATH} is required!'
  },
  Command: {
    type: ObjectId,
  },
  Damage: {
    type: String,
  },
  Guard: {
    type: String
  },
  StartUp: {
    type: String
  },
  Active: {
    type: String
  },
  Recovery: {
    type: String
  },
  OnBlock: {
    type: String
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

var Moves = mongoose.model("Moves", MoveSchema);

module.exports = Moves; 