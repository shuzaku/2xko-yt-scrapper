var Player = require("../models/players");
var ObjectId = require('mongodb').ObjectId;

// Add new player
function addPlayer(req, res) {
  var db = req.db;
  var name = req.body.Name;
  var imageUrl = req.body.ImageUrl;
  var randomNumber = Math.floor(1000 + Math.random() * 9000);
  var formattedName = name.replace(/ /g, '').replace('-','').replace('_','');
  var slug  = `${formattedName.toLowerCase()}-${randomNumber}`;

  var new_player = new Player({
    Name: name,
    ImageUrl: imageUrl,
    Slug: slug
  })

  new_player.save(function (error, player) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!',
      playerId: player.id
    })
  })
}

// Fetch all players
function getPlayers(req, res) {
  Player.find({}, 'Name PlayerImg Slug', function (error, players) {
    if (error) { console.error(error); }
    res.send({
      players: players
    })
  }).sort({ _id: -1 })
}

// Fetch single player
function getPlayer(req, res) {
  var db = req.db;
  Player.findById(req.params.id, 'Name PlayerImg Slug', function (error, player) {
    if (error) { console.error(error); }
    res.send(player)
  })
}

// Update a player
function updatePlayer(req, res) {
  var db = req.db;
  Player.findById(req.params.id, 'Name PlayerImg', function (error, player) {
    if (error) { console.error(error); }

    player.Name = req.body.Name;
    player.PlayerImg = req.body.PlayerImg;

    player.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
}

// Delete a player
function deletePlayer(req, res) {
  var db = req.db;
  Player.remove({
    _id: req.params.id
  }, function (err, player) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
}

// Query Player
function queryPlayer(req, res) {
  var db = req.db;
  var names = req.query.queryName.split(",");
  var values = req.query.queryValue.split(",");
  var queries = [];

  for(var i = 0; i < names.length; i++){
    var query = {};
    if(names[i] === ('Id')){
      var query = {'_id':   ObjectId(values[i])};
      queries.push(query);
    }  else {
      query[names[i]] = values[i];
      queries.push(query);
    }
  }
  
  if(queries.length > 1) {
    Player.find({ $or: queries }, 'Name PlayerImg ', function (error, players) {
      if (error) { console.error(error); }
      res.send({
        players: players
      })
    }).sort({ Name: 1 })    
  }
  else {
    Player.find(queries[0], 'Name PlayerImg ', function (error, players) {
      if (error) { console.error(error); }

      res.send({
        players: players
      })
    }).sort({ Name: 1 })    
  }
};

function getPlayerBySlug(req, res) {
  var aggregate = [];
  aggregate.push({$match: { "Slug" : req.params.slug }});

    Player.aggregate(aggregate, function (error, players) {
      if (error) { console.error(error); }
      res.send({
        players: players
      })
    })
}

module.exports = 
{
  addPlayer, 
  getPlayer, 
  getPlayers, 
  updatePlayer, 
  deletePlayer, 
  queryPlayer, 
  getPlayerBySlug
}