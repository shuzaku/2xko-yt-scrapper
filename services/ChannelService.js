var moment = require('moment'); // require
var Creator = require("../models/creators");

  function getLastUpdatedAt(youtubeId) {
    console.log('getting channel info...')
    return new Promise((resolve, reject) => {
      Creator.find({YoutubeId: youtubeId}, 'updatedAt ', function (error, contentCreator) {
        if (error) { console.error(error); reject()}
          resolve(contentCreator[0] ? contentCreator[0].updatedAt: null) 
        })
    })
  };

  function updateChannel(videoUrl, channelId){
    console.log(`updating channel`)
    return new Promise((resolve, reject) => {
      Creator.findById(channelId, 'Name YoutubeUrl YoutubeId LogoUrl LastVideoId', function (error, creator) {
        if (error) { console.error(error); }
          creator.LastVideoId = videoUrl;
          creator.updatedAt = moment();
          creator.save(function (error) {
            if (error) {
              console.log(error)
              reject();
            }
            resolve();
          })
      })
    }); 
  }
  module.exports = { getLastUpdatedAt, updateChannel };