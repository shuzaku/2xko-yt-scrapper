var Move = require("../models/moves");
var ObjectId = require('mongodb').ObjectId;

// Fetch all Tag

  // Fetch single character
  function getCharacterMoves(req, res) {
    var aggregate = [];
    aggregate.push({$match: { "CharacterId" : ObjectId(req.params.id) }});
  
    Move.aggregate(aggregate, function (error, moves) {
        if (error) { console.error(error); }
        res.send({
          moves: moves
        })
      })
    }


module.exports = { getCharacterMoves}