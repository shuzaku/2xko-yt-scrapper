var CharacterMatchups = require("../models/character-matchups");
var ObjectId = require('mongodb').ObjectId;

// Add new game
function addCharacterMatchup(req, res) {
  var characters = req;
  characters.forEach(character => {
    character.matchups.forEach(matchup =>{
      getMatchup(matchup.characterId, matchup.opposingCharacterId).then((matchupId) =>{
        if(!matchupId) {
          postCharacterMatchup(matchup);
        } else {
          patchCharacterMatchup(matchupId,matchup)
        }
      });
    })
  });
}

function getMatchup(characterId, opposingCharacterId){
  return new Promise((resolve, reject) => {
    CharacterMatchups.find({
      '$and': [
        {"CharacterId": ObjectId(characterId) } , 
        {"OpposingCharacterId": ObjectId(opposingCharacterId) }
      ]
    }, function (error, matchups) {
      if (error) { console.error(error); reject()}
      resolve(matchups[0]);
    })
  });
}

function postCharacterMatchup(matchup){
  var new_matchup = new CharacterMatchups({
    CharacterId: ObjectId(matchup.characterId),
    OpposingCharacterId: ObjectId(matchup.opposingCharacterId),
    Title: matchup.title,
    Class: matchup.class,
    Value: matchup.value,
  })

  new_matchup.save(function (error) {
    if (error) {
      console.log(error)
    } else {
      console.log('matchup created')
    }
  })  
}

function patchCharacterMatchup(matchupId, matchup){
  CharacterMatchups.findById(matchupId, 'Title Class Value', function (error, characterMatchup) {
    characterMatchup.Title = matchup.title;
    characterMatchup.Class = matchup.class;
    characterMatchup.Value = matchup.value;

    characterMatchup.save(function (error, matchup) {
      if (error) {
        console.log(error)
      }
    })
  })
}

function queryCharacterMatchup(req, res){
  var characterId = req.query.characterId;
  var opposingCharacterId = req.query.opposingCharacterId;
  CharacterMatchups.find({
    '$and': [
      {"CharacterId": ObjectId(characterId) } , 
      {"OpposingCharacterId": ObjectId(opposingCharacterId) }
    ]
  }, function (error, matchups) {
    if (error) { console.error(error); reject()}
    res.send({
      matchups: matchups
    })
  })
}

module.exports = { addCharacterMatchup, queryCharacterMatchup }