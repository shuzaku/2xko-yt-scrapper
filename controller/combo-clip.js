var ComboClip = require("../models/combo-clips");

var ObjectId = require('mongodb').ObjectId;

// Fetch single combo
function getComboClip(req, res) {
  var comboClipId =  ObjectId(req.params.id);
  var aggregate = [
    {
      '$lookup': {
        'from': 'combos', 
        'localField': 'ComboId', 
        'foreignField': '_id', 
        'as': 'Combo'
      }
    },
    {
      '$unwind': {
        'path': '$Combo', 
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Combo.CharacterId', 
        'foreignField': '_id', 
        'as': 'Character'
      }
    },
    {
      '$unwind': {
        'path': '$Character', 
        'preserveNullAndEmptyArrays': true
      }
    }  
  ]

  aggregate.unshift({$match: { _id: ObjectId(comboClipId) }});
  ComboClip.aggregate(aggregate, function (error, comboClip) {
    if (error) { console.error(error); }
    res.send({
      comboClip: comboClip
    })
  })
}

module.exports = { getComboClip}