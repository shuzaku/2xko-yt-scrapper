var Game = require("../models/games");
var ObjectId = require('mongodb').ObjectId;

// Add new game
function addGame(req, res) {
  var Title = req.body.Title;
  var LogoUrl = req.body.LogoUrl;
  var new_game = new Game({
    Title: Title,
    LogoUrl: LogoUrl,
  })

  new_game.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
}

// Fetch all games
function getGames(req, res) {
  Game.aggregate([{$match: {
    _id: {
      $ne: ObjectId("000000000000000000000000")
    }
  }
  }], function (error, games) {
    if (error) { console.error(error); }
    res.send({
      games: games
    })
  })
}

// Fetch single game
function getGame(req, res) {
  var db = req.db;
  Game.findById(req.params.id, 'Title LogoUrl FeaturedCharacter NewCharacter Banner', function (error, game) {
    if (error) { console.error(error); }
    res.send(game)
  })
}

// Query Games
function queryGame(req, res) {
  var names = req.query.queryName.split(",");
  var values = req.query.queryValue.split(",");
  var queries = [];

  for(var i = 0; i < names.length; i++){
    var query = {};
    query[names[i]] = values[i];
    queries.push(query);
  }
  
  if(queries.length > 1) {
    Game.find({ $or: queries }, 'Title Logo', function (error, games) {
      if (error) { console.error(error); }
      res.send({
        games: games
      })
    }).sort({ _id: -1 })    
  }
  else {
    Game.find(queries[0], 'Title Logo', function (error, games) {
      if (error) { console.error(error); }
      res.send({
        games: games
      })
    }).sort({ _id: -1 })    
  }
}

// Update a game
function updateGame(req, res) {
  var db = req.db;
  Game.findById(req.params.id, 'Title Logo', function (error, game) {
    if (error) { console.error(error); }

    game.Title = req.body.GameTitle;
    game.Logo = req.body.Logo;
    game.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    }) 
  })
}

// Delete a game
function deleteGame(req, res) {
  var db = req.db;
  Game.remove({
    _id: req.params.id
  }, function (err, game) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
}

module.exports = { addGame, getGames, getGame, queryGame, updateGame, deleteGame}