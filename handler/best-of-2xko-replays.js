//controllers
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment'); // require

var characterService = require( "../services/CharacterService");
var playerService = require( "../services/PlayerService");
var channelService = require( "../services/ChannelService");
var youtubeService = require( "../services/YoutubeService");
var matchService = require( "../services/MatchService");
require('dotenv').config();

var channel = {
    id: ObjectId('68ccb86ba764a3da7078a3f8'),
    youtubeId:'UCbMeGYYlzSwYv2pGnVSTDaw',
    name: '2XKO Pro Replays',
    channelVideos: [],
    updatedAt: null
}

var characterList = null;
var mongoGameId = process.env.GAME_ID;

    function run(){
        characterService.getCharacters(mongoGameId).then((response)=> {
            characterList = response;
            characterList = characterList.filter(character => character.GameId === mongoGameId);

            channelService.getLastUpdatedAt(channel.youtubeId).then(updatedAt => {
                channel.updatedAt = updatedAt ? updatedAt : null;
                youtubeService.getVideos(channel).then((response)=> {
                    mapVideos(response)
                })
            });
        });
    };

    async function mapVideos(youtubeResponse) {
        var response = youtubeResponse.filter(video => video.id.kind === "youtube#video" && video.snippet.title.toLowerCase().includes('vs'))
        var mappedVideos = await Promise.all(response.map(async video => {
            var lowerCaseTitle =  video.snippet.title.toLowerCase();
            var team1 = await getTeam1(lowerCaseTitle.split("vs")[0]);
            var team2 = await getTeam2(lowerCaseTitle.split("vs")[1]);
            return {
                id: video.id.videoId,
                title: video.snippet.title,
                player1: team1,
                player2: team2,
                videoUrl: video.id.videoId,
                gameId: ObjectId(mongoGameId),
                publishedAt: moment(video.snippet.publishedAt)
            }
        }));
        filterVideos(mappedVideos);
    };

    function filterVideos(mappedVideos){
        mappedVideos = channel.updatedAt ? mappedVideos.filter(v => v.publishedAt.isAfter(channel.updatedAt)) : mappedVideos;
        mappedVideos = mappedVideos.filter(v => v.player1[0].characterIds && v.player2[0].characterIds )

        console.log(`adding...${mappedVideos.length} videos` )

        if(mappedVideos.length > 0){
            matchService.postMatches(mappedVideos.reverse(), channel.id);
        }
    };

    function getPlayer1CharacterIds(title){
            var start = (title.indexOf('(')) + 1;
            var end = (title.indexOf(')'));

            var character1Name = title.slice(start,end);
            var characterIds = characterService.getCharacterIdByName(character1Name, characterList)
            return(characterIds) ;
    };

    function getPlayer2CharacterIds(title){

            var start = (title.indexOf('(')) + 1;
            var end = (title.indexOf(')'));

            var character2Name = title.slice(start,end);
            var characterIds = characterService.getCharacterIdByName(character2Name, characterList);
            return(characterIds);
    };

    function getTeam1(title){
        return new Promise((resolve, reject) => {
            var start = 0;
            var end = title.indexOf('(') - 1;
            var team1Player1Name = title.slice(start,end);
            var team1 = [];
            var team1Player2Name = null;
            var team1Player2Split = null

            if(title.includes('&amp;')){
                team1Player2Split = title.split('&amp;')[1];
                var team1Player2Start = 0;
                var team1Player2End = team1Player2Split.indexOf('(') - 1;
                team1Player2Name = team1Player2Split.slice(team1Player2Start, team1Player2End);
            }

            if(team1Player1Name){
                playerService.getPlayerIdByName(team1Player1Name.trim())
                    .then(playerId => {
                        var characterIds = getPlayer1CharacterIds(title);
                        team1.push({id: playerId, characterIds: characterIds});
                        if(team1Player2Name){
                            playerService.getPlayerIdByName(team1Player2Name.trim())
                                .then(playerId2 => {
                                    var characterIds2 = getPlayer1CharacterIds(team1Player2Split);
                                    team1.push({id: playerId2, characterIds: characterIds2});
                                    resolve(team1);
                            })
                            .catch(reject);
                        } else {
                            resolve(team1);
                        }
                    })
                    .catch(reject);
            } else {
                resolve([]); // Always resolve, even if empty
            }
        });
    }

    function getTeam2(title){
        return new Promise((resolve, reject) => {
            var start = 0;
            var end = title.indexOf('(') - 1;
            var team2Player1Name = title.slice(start,end);
            var team2 = [];
            var team2Player2Name = null;
            var team2Player2Split = null

            if(title.includes('&amp;')){
                team2Player2Split = title.split('&amp;')[1];
                var team2Player2Start = 0;
                var team2Player2End = team2Player2Split.indexOf('(') - 1;
                team2Player2Name = team2Player2Split.slice(team2Player2Start, team2Player2End);
            }

            if(team2Player1Name){
                playerService.getPlayerIdByName(team2Player1Name.trim())
                    .then(playerId => {
                        var characterIds = getPlayer2CharacterIds(title);
                        team2.push({id: playerId, characterIds: characterIds});
                        if(team2Player2Name){
                            playerService.getPlayerIdByName(team2Player2Name.trim())
                                .then(playerId2 => {
                                    var characterIds2 = getPlayer2CharacterIds(team2Player2Split);
                                    team2.push({id: playerId2, characterIds: characterIds2});
                                    resolve(team2);
                            })
                            .catch(reject);
                        } else {
                            resolve(team2);
                        }
                    })
                    .catch(reject);
            } else {
                resolve([]); // Always resolve, even if empty
            }

        });
    };
    

    module.exports = run

// app.listen(process.env.PORT || 80);

