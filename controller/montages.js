var Montage = require("../models/montages");
var ObjectId = require('mongodb').ObjectId;

// Add new Montage
function addMontage(req, res) {
  var Players = req.body.Players.map(player => {return ObjectId(player)});
  var VideoUrl = req.body.VideoUrl;
  var GameId = req.body.GameId;
  var Characters = req.body.Characters.map(character => {return ObjectId(character.Id)});
  var Created = Date.now();
  var Updated = Date.now();
  var isDuplicate = Montage.find({ "VideoUrl" : VideoUrl}  , function (error, montages) {
    if (error) { console.error(error); }
    if(montages.length > 0){
      res.send({
        success: true,
        err: 'Montage already exist',
      });   
    }
    else {
      var new_montage = new Montage({
        Players: Players,
        VideoUrl: VideoUrl,
        GameId: GameId,
        Characters: Characters,
        Created: Created,
        Updated: Updated
      })
    
      new_montage.save(function (error,montage) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true,
          message: 'Post saved successfully!',
        })
      })
    }
  }).sort({ Name: 1 }) .limit(1);



}

// Fetch single match
function getMontage(req, res) {
  var montageId =  ObjectId(req.params.id);

  var aggregate = [
    {
      '$lookup': {
        'from': 'players', 
        'localField': 'Players', 
        'foreignField': '_id', 
        'as': 'Player'
      }
    },{
      '$lookup': {
        'from': 'characters', 
        'localField': 'Characters', 
        'foreignField': '_id', 
        'as': 'Characters'
      }
    },{
      '$lookup': {
        'from': 'games', 
        'localField': 'GameId', 
        'foreignField': '_id', 
        'as': 'Game'
      }
    },
  ]

  aggregate.unshift({$match: { _id: montageId }});

  Montage.aggregate(aggregate, function (error, montages) {
    if (error) { console.error(error); }
    res.send({
      montages: montages
    })
  })
}

module.exports = { addMontage, getMontage }