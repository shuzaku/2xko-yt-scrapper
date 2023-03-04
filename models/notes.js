var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

var NoteSchema = new Schema({
  Type: {
    type: String,
    required: '{PATH} is required!'
  },
  Target1: {
    type: String
  },
  Target2: {
    type: String
  },
  Heading: {
    type: String
  },
  Content: {
    type: String,
  },
  CreatedAt: {
    type: Date
  },
  UpdatedAt: {
    type: Date
  },
  AuthorId: {
    type: ObjectId
  },
  GameId: {
    type: ObjectId
  }
}, {
  timestamps: true, 
});

var Notes = mongoose.model("Notes", NoteSchema);

module.exports = Notes; 