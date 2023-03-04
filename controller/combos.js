var Combo = require("../models/combos");
var ComboClip = require("../models/combo-clips");

var ObjectId = require('mongodb').ObjectId;

// // Add new Combo
// function addCombo(req, res) {
//   var CharacterId = req.body.CharacterId;
//   var Inputs = req.body.Inputs;
//   var Hits = req.body.Hits;
//   var Damage = req.body.Damage;

//   var new_combo = new Combo({
//     CharacterId: CharacterId,
//     Inputs: Inputs,
//     Hits: Hits,
//     Damage: Damage
//   })

//   new_combo.save(function (error,combo) {
//     if (error) {
//       console.log(error)
//     }
//     res.send({
//       success: true,
//       message: 'Post saved successfully!',
//       id: combo.id
//     })
//   })
// }

function addCombo(req, res) {
  if(!req.query.bulk){
    var CharacterId = req.body.CharacterId;
    var Inputs = req.body.Inputs;
    var Hits = req.body.Hits;
    var Damage = req.body.Damage;
    var Tags = req.body.Tags.map((tag) => {
      return ObjectId(tag)
    });
  
    var new_combo = new Combo({
      CharacterId: CharacterId,
      Inputs: Inputs,
      Hits: Hits,
      Damage: Damage,
      Tags: Tags
    })
  
    new_combo.save(function (error,combo) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true,
        message: 'Post saved successfully!',
        id: combo.id
      })
    })
  }
  else {
    Combo.insertMany(req.body, function(error,combos){
      if (error) {
        console.log(error)
      }
      res.send({
        success: true,
        message: 'Characters saved successfully!',
        combos: combos
      })      
    })
  }
};

// Update a Combo
function patchCombo(req, res) {
  Combo.findById(ObjectId(req.params.id), 'CharacterId Inputs Hits Damage', function (error, combo) {
    if (error) { console.error(error); }
    
    combo.CharacterId = req.body.CharacterId;
    combo.Inputs = req.body.Inputs;
    combo.Hits = req.body.Hits;
    combo.Damage = req.body.Damage;

    combo.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
}

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

function deleteCombo(req, res) {
  var db = req.db;
  Combo.remove({
    _id: req.params.id
  }, function (err, character) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
}
module.exports = { addCombo, patchCombo, getComboClip, deleteCombo}