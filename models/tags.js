var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = new Schema({
    TagName: {
      type: String,
      required: '{PATH} is required!'
    }
  }, {
    timestamps: true, 
  });

var Tags = mongoose.model("Tags", TagSchema);

module.exports = Tags; 