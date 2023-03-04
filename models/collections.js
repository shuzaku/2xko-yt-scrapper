var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var CollectionSchema = new Schema({
  Name: {
    type: String,
    required: '{PATH} is required!'
  },
  Videos: {
    type: Array
  },
  OwnerId: {
    type: ObjectId,
    required: '{PATH} is required!'
  }
}, {
  timestamps: true, 
});

var Collections = mongoose.model("Collections", CollectionSchema);

module.exports = Collections; 