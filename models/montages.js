var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var MontageSchema = new Schema({
  Players: {
    type: Array,
    required: '{PATH} is required!'
  },
  VideoUrl: {
    type: String,
    required: '{PATH} is required!'
  },
  GameId: {
    type: ObjectId,
    required: '{PATH} is required!'
  },
  Characters: {
    type: Array,
    required: '{PATH} is required!'
  },
  Created: {
    type: Date
  },
  Updated: {
    type: Date
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

var Montages = mongoose.model("Montages", MontageSchema);

module.exports = Montages; 