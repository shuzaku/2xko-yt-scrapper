var Player = require("../models/players");


  function getPlayerIdByName(name) {
    return new Promise((resolve, reject) => {
      Player.find({'Name': name}, 'Name', function (error, player) {
        if (error) { console.error(error); reject(error)}

        if(player.length > 0){
          console.log(`found ${player[0].Name}`)
          return resolve(player[0]._id)  
        } 

        console.log(`adding ${name}`)
        addPlayer(name).then((id)=> {
          resolve(id);
        }).catch(err => {
          reject(err);
        });

      }).collation({'locale': 'en', 'strength': 2})
    });
  }

  function addPlayer(playerName){
    return new Promise((resolve,reject) => {
      var formattedName = playerName.replace(/ /g, '').replace('-','').replace('_','');
      var randomNumber = Math.floor(1000 + Math.random() * 9000);
  
      var slug  = `${formattedName.toLowerCase()}-${randomNumber}`;
  
      var new_player = new Player({
        Name: playerName,
        Slug: slug
      })

      console.log('adding...', playerName)
      new_player.save(function (error, player) {
          if (error) {
            console.log(error)
            reject(error);
          }
          resolve(player._id) 
  
      })
    });
  }

  module.exports = { getPlayerIdByName, addPlayer };