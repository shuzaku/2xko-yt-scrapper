var channelService = require( "./ChannelService");
var videoService = require("../services/VideoService");
var Match = require("../models/matches");
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment'); // require

function postMatches (matches, channelId){
    var matches = matches.map(match =>{
      return new Match({
        VideoUrl: match.videoUrl,
        GameId: match.gameId,
        Team1Players: match.player1.map((player, index) =>{
          return {
            Slot:index + 1,
            Id: ObjectId(player.id),
            CharacterIds: player.characterIds.map((id)=> {return ObjectId(id)}),
          }
        }),
        Team2Players: match.player2.map((player, index) =>{
          return {
            Slot:index + 1,
            Id: ObjectId(player.id),
            CharacterIds: player.characterIds.map((id)=> {return ObjectId(id)}),
          }
        }),
        SubmittedBy: ObjectId('6314df6cc141db206893b6a7'),
        UpdatedBy: ObjectId('6314df6cc141db206893b6a7'),
      })
    })
  
    
    matches = matches.filter(match => {
      var hasIds = match.Team1Players[0].Id && match.Team2Players[0].Id;
      var hasCharacterIds = match.Team1Players[0].CharacterIds.length > 0 && match.Team2Players[0].CharacterIds.length > 0
      return hasIds && hasCharacterIds
    })
    
    console.log(matches.length)
    matches.sort((a, b) => moment(a.UpdatedBy).diff(moment(b.UpdatedBy)))
      this.sendMatches(matches).then( ()=>{
        videoService.postVideos(matches, channelId).then( ()=>{
          channelService.updateChannel(matches[matches.length-1].VideoUrl, channelId)
            console.log('Done...app')
        })
      })
  }

  function sendMatches(matches){
    console.log(`saving matches`)
    return new Promise((resolve, reject) => {
      Match.insertMany(matches, function(error){
        if (error) {
          console.log(error)
          reject(); 
        }
        resolve();
      }); 
    });
  }

  module.exports = { postMatches, sendMatches };