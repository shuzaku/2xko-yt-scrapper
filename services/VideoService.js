var Video = require("../models/videos")

function postVideos(matches, channelId){
  console.log(`saving videos `)
  return new Promise((resolve, reject) => {
    var videos = matches.map(match => {
      return {
        Url: match.VideoUrl,
        ContentType: "Match",
        VideoType: "youtube",
        GameId:  match.GameId,
        ContentCreatorId: channelId
      }
    })

    Video.insertMany(videos, function(error,){
      if (error) {
        console.log(error);
        reject();
      }
      resolve();
    })    
  });
}

module.exports = { postVideos };