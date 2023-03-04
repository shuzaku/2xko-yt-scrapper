var Character = require("../models/characters");
var ObjectId = require('mongodb').ObjectId;

// Add new character(s)
function addCharacter(req, res) {
    if(!req.query.bulk){
      var Name = req.body.Name;
      var GameId = req.body.GameId
      var ImageUrl = req.body.ImageUrl;
      var AvatarUrl = req.body.AvatarUrl;

      var new_character = new Character({
        Name: Name,
        GameId: GameId,
        ImageUrl: ImageUrl,
        AvatarUrl: AvatarUrl
      })
    
      new_character.save(function (error) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true,
          message: 'Character saved successfully!'
        })
      })
    }
    else {
      Character.insertMany(req.body, function(error){
        if (error) {
          console.log(error)
        }
        res.send({
          success: true,
          message: 'Characters saved successfully!'
        })      
      })
    }
  };
  
  // Query Characters
function queryCharacter(req, res) {
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
      Character.find({ $or: queries }, 'Name ImageUrl AvatarUrl Slug', function (error, characters) {
        if (error) { console.error(error); }
        res.send({
          characters: characters
        })
      }).sort({ Name: 1 })    
    }
    else {
      Character.find(queries[0], 'Name ImageUrl AvatarUrl Slug', function (error, characters) {
        if (error) { console.error(error); }

        res.send({
          characters: characters
        })
      }).sort({ Name: 1 })    
    }
  };
  
  // Fetch all characters
function getCharacters(req, res) {
    Character.find({}, 'Name GameId ImageUrl AvatarUrl FeaturedPlayers', function (error, characters) {
      if (error) { console.error(error); }
      res.send({
        characters: characters
      })
    }).sort({ _id: -1 })
  };
  
  // Fetch single character
function getCharacter(req, res) {
  var aggregate = [{
    '$lookup': {
      'from': 'players', 
      'localField': 'FeaturedPlayers', 
      'foreignField': '_id', 
      'as': 'Players'
    }
  }];
  aggregate.push({$match: { "_id" : ObjectId(req.params.id) }});

    Character.aggregate(aggregate, function (error, characters) {
      if (error) { console.error(error); }
      res.send({
        characters: characters
      })
    })
  }


    // Fetch single character
function getCharacterBySlug(req, res) {
  var aggregate = [{
    '$lookup': {
      'from': 'players', 
      'localField': 'FeaturedPlayers', 
      'foreignField': '_id', 
      'as': 'Players'
    }
  }];
  aggregate.push({$match: { "Slug" : req.params.slug }});

    Character.aggregate(aggregate, function (error, characters) {
      if (error) { console.error(error); }
      res.send({
        characters: characters
      })
    })
  }


  // Update a character
function updateCharacter(req, res) {
    var db = req.db;
    Character.findById(req.params.id, 'Name GameId ImageUrl AvatarUrl FeaturedPlayers', function (error, character) {
      if (error) { console.error(error); }
      character.Name = req.body.Name;
      character.GameId = req.body.GameId
      character.ImageUrl = req.body.ImageUrl;
      character.save(function (error) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true
        })
      }) 
    })
  }

  // Delete a character
function deleteCharacter(req, res) {
    var db = req.db;
    Character.remove({
      _id: req.params.id
    }, function (err, character) {
      if (err)
        res.send(err)
      res.send({
        success: true
      })
    })
  }


// Query matchup info
function getMatchupInfo(req, res) {
  var queries = [];

  var character1 = ObjectId(req.query.character1);
  var character2 = ObjectId(req.query.character2);

  queries.push({'_id':   character1});
  queries.push({'_id':   character2});

  Character.find({ $or: queries }, 'Name ImageUrl AvatarUrl GameId FeaturedPlayers', function (error, characters) {
    if (error) { console.error(error); }
    res.send({
      characters: characters
    })
  });
   
}

module.exports = { addCharacter, queryCharacter, getCharacters, getCharacter, updateCharacter, deleteCharacter, getMatchupInfo, getCharacterBySlug }
