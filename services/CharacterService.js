var Character = require("../models/characters");

   function getCharacters(gameId) {
    console.log('getting characters...')
    return new Promise((resolve, reject) => {
      Character.find({}, 'Name GameId', function (error, characters) {
        if (error) { console.error(error); reject() }
          resolve(characters) 
        })
    });
  };

  function getCharacterIdByName(name, characterList) {
      var characters = characterList.filter(c => name.toLowerCase().includes(c.Name.toLowerCase()));
      var characterIds = [];
      if(characters){
        characters.forEach(character => {
          characterIds.push(character._id);
        });
      }

      return characterIds
  }
  module.exports = { getCharacters, getCharacterIdByName };