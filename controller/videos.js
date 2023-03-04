var Video = require("../models/videos");
var ObjectId = require('mongodb').ObjectId;

// Add new Video
function addVideo(req, res) {
  if(!req.query.bulk){
    var Url = req.body.Url;
    var ContentType = req.body.ContentType
    var ContentCreatorId = req.body.ContentCreatorId;
    var VideoType = req.body.VideoType;
    var GameId = req.body.GameId;
    var StartTime = req.body.StartTime;
    var EndTime = req.body.EndTime;
    var Combos = ContentType === 'Combo' ? req.body.Combos.map(combo => {
      return {
        Id: ObjectId(combo.Id),
        StartTime: combo.StartTime,
        Endtime: combo.EndTime
      }
    }): null;
    var Tags = req.body.Tags;

    var isDuplicate = Video.find({ "Url" : Url}).limit(1).size();
  
    // if(isDuplicate){
    //   res.send({
    //     success: true,
    //     err: 'Video already exist',
    //   });  
    // }
    // else {
      var new_video = new Video({
        Url: Url,
        ContentType: ContentType,
        VideoType: VideoType,
        StartTime: StartTime,
        EndTime: EndTime,
        GameId: GameId,
        Tags: Tags,
        Combos: Combos
      })

      if(ContentCreatorId) {
        new_video.ContentCreatorId = ContentCreatorId;
      }
      
      new_video.save(function (error) {
        if (error) {
          console.log(error)
        }
        res.send({
          success: true,
          message: 'Post saved successfully!'
        })
      })  
    // }
  } else {
    Video.insertMany(req.body, function(error,videos){
      if (error) {
        console.log(error)
      }
      res.send({
        success: true,
        message: 'Videos saved successfully!',
        videos: videos
      })      
    })    
  }
}
// Query Videos
function fetchVideos(req, res) {
  var skip =  parseInt(req.query.skip);
  var aggregate = [
    {
      '$sort': 
        {'_id': -1}
      
    },{
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    }, {
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      }
    },{
      '$lookup': {
        'from': 'combo-clips', 
        'localField': 'Url', 
        'foreignField': 'Url', 
        'as': 'ComboClip'
      }
    }, {
      '$unwind': {
        'path': '$ComboClip', 
        'preserveNullAndEmptyArrays': true
      }
    },{
      '$lookup': {
        'from': 'combos', 
        'localField': 'ComboClip.ComboId', 
        'foreignField': '_id', 
        'as': 'Combo'
      }
    },{
      '$unwind': {
        'path': '$Combo', 
        'preserveNullAndEmptyArrays': true
      }
    },
  ];

  
  aggregate.push({$skip: skip});
  aggregate.push({$limit: 5});  
  
  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
  })
}

// Query Videos
function queryVideo(req, res) {
  var queries = [];
  var query = null;
  var skip =  parseInt(req.query.skip);
  var sort = req.query.sort || '_id';
  var filter = req.query.filter;
  var tagFilter = req.query.tag ? ObjectId(req.query.tag): null;
  var aggregate = [
    {
      '$lookup': {
        'from': 'games', 
        'localField': 'GameId', 
        'foreignField': '_id', 
        'as': 'Game'
      }
    }, {
      '$unwind': '$Game'
    }, {
      '$lookup': {
        'from': 'montages', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Montage'
      }
    }, {
      '$unwind': {
        'path': '$Montage', 
        'preserveNullAndEmptyArrays': true
      }
    },{
      '$lookup': {
        'from': 'characters',
        'localField': 'Montage.Characters',
        'foreignField': '_id',
        'as': 'MontageCharacters'
      }
    },{
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    }, {
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team1Players.Id', 
        'foreignField': '_id', 
        'as': 'Team1Players'
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team2Players.Id', 
        'foreignField': '_id', 
        'as': 'Team2Players'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team1Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Team1PlayerCharacters'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team2Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Team2PlayerCharacters'
      }
    }, {
      '$lookup': {
        'from': 'combo-clips', 
        'localField': 'Url', 
        'foreignField': 'Url', 
        'as': 'ComboClip'
      }
    }, {
      '$unwind': {
        'path': '$ComboClip', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'creators', 
        'localField': 'ContentCreatorId', 
        'foreignField': '_id', 
        'as': 'ContentCreator'
      }
    },{
      '$unwind': {
        'path': '$ContentCreator', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'tags', 
        'localField': 'Combo.Tags', 
        'foreignField': '_id', 
        'as': 'Combo.Tags'
      }
    },{
      '$lookup': {
        'from': 'combos', 
        'localField': 'ComboClip.ComboId', 
        'foreignField': '_id', 
        'as': 'Combo'
      }
    },{
      '$unwind': {
        'path': '$Combo', 
        'preserveNullAndEmptyArrays': true
      }
    },{
      '$lookup': {
        'from': 'characters', 
        'localField': 'Combo.CharacterId', 
        'foreignField': '_id', 
        'as': 'Character'
      }
    },{
      '$unwind': {
        'path': '$Character', 
        'preserveNullAndEmptyArrays': true
      }
    },{
      '$addFields': {
        'Id': '$_id'
      }
    }
  ];

  if (req.query.queryName || req.query.queryValue){
    var names = req.query.queryName.split(",");
    var values = req.query.queryValue.split(",");
    var query = {};
    //parse query for player id
    for(var i = 0; i < names.length; i++){
      var query = {};

      switch (names[i]){
        case 'PlayerId':
          var playerQuery= [
            {"Team1Players": { '$elemMatch': { '_id':  ObjectId(values[i]) } }},
            {"Team2Players": { '$elemMatch': { '_id':  ObjectId(values[i]) } }}
          ];  
          queries.push({$or: playerQuery});
        break

        case 'PlayerSlug':
          var playerQuery= [
            {"Team1Players": { '$elemMatch': { 'Slug': values[i] } }},
            {"Team2Players": { '$elemMatch': { 'Slug': values[i] } }}
          ];  
          queries.push({$or: playerQuery});
        break
        
        case 'PlayerMatchupCharacterId':
          queries = [];
          var playerId = values[names.indexOf('PlayerId')];
          var characterId = values[i];
          var matchupQuery = [
            {'$and': [{"Team1Players": { '$elemMatch': { '_id':  ObjectId(playerId) } }} , {"Team2PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(characterId) } }}]},
            {'$and': [{"Team2Players": { '$elemMatch': { '_id':  ObjectId(playerId) } }} , {"Team1PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(characterId) } }}]},
          ]
          queries.push({$or: matchupQuery});
          break

          case 'CharacterMatchupCharacterId':
            queries = [];
            var characterId = values[names.indexOf('CharacterId')];
            var matchupCharacterId = values[i];
            var matchupQuery = [
              {'$and': [{"Team1PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(characterId) } }} , {"Team2PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(matchupCharacterId) } }}]},
              {'$and': [{"Team2PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(characterId) } }} , {"Team1PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(matchupCharacterId) } }}]},
            ]
            queries.push({$or: matchupQuery});
            break

        case 'CharacterId':
          var characterQuery= [
            {"Team1PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(values[i]) } }},
            {"Team2PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(values[i]) } }},
            {'MontageCharacters': { '$elemMatch': { '_id':  ObjectId(values[i]) } }},
            {'Combo.CharacterId': {'$eq': ObjectId(values[i])}},
          ];
          queries.push({$or: characterQuery});
          break

          case 'CharacterSlug':
            var characterQuery= [
              {"Team1PlayerCharacters": { '$elemMatch': { 'Slug': values[i] } }},
              {"Team2PlayerCharacters": { '$elemMatch': { 'Slug': values[i] } }},
              {'MontageCharacters': { '$elemMatch': { 'Slug': values[i] } }},
              // {'Combo.CharacterId': {'$eq': ObjectId(values[i])}},
            ];
            queries.push({$or: characterQuery});
            break

        case 'VideoId':
            queries.push({'_id': {'$eq': ObjectId(values[i])}});
          break

        default: 
          if(names[i].includes('Id')){
            query[names[i]] =  {'$eq': ObjectId(values[i])};
            queries.push(query);
          } else {
            query[names[0]] =  {'$eq': values[0]};
            queries.push(query);
          }
      }
    }
    if(names.some(n => n === "VideoId")){
      aggregate.push({$match: {$or: queries}});
    }
  };

  if(queries.length > 0) {
    aggregate.push({$match: {$and: queries}});
  }

  if(sort === "Damage"){
    aggregate.push({$sort: {'Combo.Damage': -1}})
  } else if(sort === "Hits") {
    aggregate.push({$sort: {'Combo.Hits': -1}})
  } else {
    aggregate.push({$sort: {'_id': -1}})
  }
  
  if(filter){
    if (filter === 'Combo'){
      aggregate.push({$match: {ContentType:'Combo'}})
    } else if (filter === 'Match'){
      aggregate.push({$match: {ContentType: 'Match'}})
    } else if (filter === 'Montage'){
      aggregate.push({$match: {ContentType: 'Montage'}})
    }
  }
  if(tagFilter){
    aggregate.push({$match: {"Combo.Tags": { '$elemMatch': { '_id':  ObjectId(tagFilter) } }}});
  }
  
  aggregate.push({$sort: {'_id': -1}})
  aggregate.push({$skip: skip});
  aggregate.push({$limit: 5});  
  
  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
  })
}

// Query by character
function queryVideoByCharacter(req, res) {
  var queries = [];
  var skip =  parseInt(req.query.skip);
  var aggregate = [ 
    {
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    }, {
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team1Players.Id', 
        'foreignField': '_id', 
        'as': 'Team1Players'
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team2Players.Id', 
        'foreignField': '_id', 
        'as': 'Team2Players'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team1Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Team1PlayerCharacters'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team2Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Team2PlayerCharacters'
      }
    }, {
      '$lookup': {
        'from': 'combo-clips', 
        'localField': 'Url', 
        'foreignField': 'Url', 
        'as': 'ComboClip'
      }
    }, {
      '$unwind': {
        'path': '$ComboClip', 
        'preserveNullAndEmptyArrays': true
      }
    },{
      '$lookup': {
        'from': 'combos', 
        'localField': 'ComboClip.ComboId', 
        'foreignField': '_id', 
        'as': 'Combo'
      }
    },{
      '$unwind': {
        'path': '$Combo', 
        'preserveNullAndEmptyArrays': true
      }
    },{
      '$lookup': {
        'from': 'characters', 
        'localField': 'Combo.CharacterId', 
        'foreignField': '_id', 
        'as': 'Character'
      }
    },{
      '$unwind': {
        'path': '$Character', 
        'preserveNullAndEmptyArrays': true
      }
    }
  ];

  if (req.query.queryName || req.query.queryValue){
    var names = req.query.queryName.split(",");
    var values = req.query.queryValue.split(",");
    //parse query for player id
    for(var i = 0; i < names.length; i++){
      switch (names[i]){
        case 'CharacterId':
          var characterQuery= [
            {"Team1PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(values[i]) } }},
            {"Team2PlayerCharacters": { '$elemMatch': { '_id':  ObjectId(values[i]) } }},
            {'Combo.CharacterId': {'$eq': ObjectId(values[i])}},
          ];
          queries.push({$or: characterQuery});
          break

          case 'CharacterSlug':
            var characterQuery= [
              {"Team1PlayerCharacters": { '$elemMatch': { 'Slug': values[i] } }},
              {"Team2PlayerCharacters": { '$elemMatch': { 'Slug': values[i] } }},
            ];
            queries.push({$or: characterQuery});
            break
      }
    }
  };

  if(queries.length > 0) {
    aggregate.push({$match: {$and: queries}});
  }
  aggregate.push({$sort: { _id: -1 }});  
  aggregate.push({$skip: skip});
  aggregate.push({$limit: 5});  
  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
  })
}

// Query by player
function queryVideoByPlayer(req, res) {
  var queries = [];
  var query = null;
  var skip =  parseInt(req.query.skip);
  var sort = req.query.sort || '_id';
  var filter = req.query.filter;
  var tagFilter = req.query.tag ? ObjectId(req.query.tag): null;
  var aggregate = [{
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    }, {
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team1Players.Id', 
        'foreignField': '_id', 
        'as': 'Team1Players'
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team2Players.Id', 
        'foreignField': '_id', 
        'as': 'Team2Players'
      }
    }
  ];

  if (req.query.queryName || req.query.queryValue){
    var names = req.query.queryName.split(",");
    var values = req.query.queryValue.split(",");
    var query = {};
    //parse query for player id
    for(var i = 0; i < names.length; i++){
      var query = {};

      switch (names[i]){
        case 'PlayerId':
          var playerQuery= [
            {"Team1Players": { '$elemMatch': { '_id':  ObjectId(values[i]) } }},
            {"Team2Players": { '$elemMatch': { '_id':  ObjectId(values[i]) } }}
          ];  
          queries.push({$or: playerQuery});
        break

        case 'PlayerSlug':
          var playerQuery= [
            {"Team1Players": { '$elemMatch': { 'Slug': values[i] } }},
            {"Team2Players": { '$elemMatch': { 'Slug': values[i] } }}
          ];  
          queries.push({$or: playerQuery});
        break
      }
    }
  };

  if(queries.length > 0) {
    aggregate.push({$match: {$and: queries}});
  }

  aggregate.push({$sort: {'_id': -1}})
  aggregate.push({$skip: skip});
  aggregate.push({$limit: 5});  
  
  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
  })
}

// Query by game
function queryVideoByGame(req, res) {
  var queries = [];
  var query = null;
  var skip =  parseInt(req.query.skip);
  var sort = req.query.sort || '_id';
  var filter = req.query.filter;
  var aggregate = [
    {
      '$lookup': {
        'from': 'games', 
        'localField': 'GameId', 
        'foreignField': '_id', 
        'as': 'Game'
      }
    }, {
      '$unwind': '$Game'
    },{
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    },{
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      } 
    }
  ];

  if (req.query.queryName || req.query.queryValue){
    var names = req.query.queryName.split(",");
    var values = req.query.queryValue.split(",");
    var query = {};
    for(var i = 0; i < names.length; i++){
      var query = {};
      switch (names[i]){
        default: 
          if(names[i].includes('Id')){
            query[names[i]] =  {'$eq': ObjectId(values[i])};
            queries.push(query);
          } else {
            query[names[0]] =  {'$eq': values[0]};
            queries.push(query);
          }
      }
    }
  };

  if(queries.length > 0) {
    aggregate.push({$match: {$and: queries}});
  }

  aggregate.push({$sort: {'_id': -1}})
  aggregate.push({$skip: skip});
  aggregate.push({$limit: 5});  
  
  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
  })
}

// Fetch single Video
function getVideo(req, res) {
  var aggregate = [
    {
      '$sort': 
        {'_id': -1}
      
    },
    {
      '$lookup': {
        'from': 'games', 
        'localField': 'GameId', 
        'foreignField': '_id', 
        'as': 'Game'
      }
    }, {
      '$unwind': '$Game'
    }, {
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    }, {
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'creators', 
        'localField': 'ContentCreatorId', 
        'foreignField': '_id', 
        'as': 'ContentCreator'
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team1Players.Id', 
        'foreignField': '_id', 
        'as': 'Match.Team1Player'
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team2Players.Id', 
        'foreignField': '_id', 
        'as': 'Match.Team2Player'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team1Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Match.Team1PlayerCharacters'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team2Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Match.Team2PlayerCharacters'
      }
    }, {
      '$unwind': {
        'path': '$ContentCreator', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$unwind': {
        'path': '$Combos', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'combos', 
        'localField': 'Combos.Id', 
        'foreignField': '_id', 
        'as': 'Combo'
      }
    }, {
      '$unwind': {
        'path': '$Combo', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Combo.CharacterId', 
        'foreignField': '_id', 
        'as': 'Combo.Character'
      }
    }, {
      '$unwind': {
        'path': '$Combo.Character', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'tags', 
        'localField': 'Combo.Tags', 
        'foreignField': '_id', 
        'as': 'Combo.ComboTags'
      }
    }, {
      '$addFields': {
        'Combo.StartTime': '$Combos.StartTime', 
        'Combo.EndTime': '$Combos.Endtime', 
        'ComboCharacterId': '$Combo.CharacterId', 
        'ComboId': '$Combo._id', 
        'Id': '$_id'
      }
    }
  ];
  var videoId = req.params.id;
  aggregate.unshift({$match: {'_id': {'$eq': ObjectId(videoId)}}});
  Video.aggregate(aggregate, function (error, video) {
    if (error) { console.error(error); }
    res.send({
      video: video
    })
    aggregate = [];
  })
  
}

// Update a Video
function patchVideo(req, res) {
  Video.findById(req.params.id, 'ContentCreatorId GameId Player1Id Player2Id Player1CharacterId Player1Character2Id Player1Character3Id Player2CharacterId Player2Character2Id Player2Character3Id Combos WinnerId Tags UpdatedDate', function (error, video) {
    if (error) { console.error(error); }

    video.ContentCreatorId = req.body.ContentCreatorId;
    video.GameId = ObjectId(req.body.GameId);
    video.Combos = req.body.Combos.map(combo => {
      return {
        Id: ObjectId(combo.Id),
        StartTime: combo.StartTime,
        EndTime: combo.EndTime
      }
    });
    video.Player1Id = req.body.Player1Id;
    video.Player2Id = req.body.Player2Id;
    video.Player1CharacterId = req.body.Player1CharacterId;
    video.Player1Character2Id = req.body.Player1Character2Id;
    video.Player1Character3Id = req.body.Player1Character3Id;
    video.Player2CharacterId = req.body.Player2CharacterId;
    video.Player2Character2Id = req.body.Player2Character2Id;
    video.Player2Character3Id = req.body.Player2Character3Id;
    video.WinnerId = req.body.WinnerId;
    video.Tags = req.body.Tags;
    video.UpdatedDate = Date.now();

    video.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
}

// Delete a Video
function deleteVideo(req, res) {
  Video.remove({
    _id: req.params.id
  }, function (err) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
}

// Fetch all Tag
function getVideos(req, res) {
  var skip =  parseInt(req.query.skip);
  var aggregate = [
    {'$sort': {'_id': -1}},
    {
      '$lookup': {
        'from': 'combos', 
        'localField': 'Combos.Id', 
        'foreignField': '_id', 
        'as': 'Combo'
      }
    },
    {
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    },
    {
      '$unwind': {
        'path': '$Combos', 
        'preserveNullAndEmptyArrays': true
      }
    }, 
    {
      '$lookup': {
        'from': 'combos', 
        'localField': 'Combos.Id', 
        'foreignField': '_id', 
        'as': 'Combo'
      }
    },
    {
      '$unwind': {
        'path': '$Combo', 
        'preserveNullAndEmptyArrays': true
      }
    }, 
    {
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      }
    }, 
  ]

  aggregate.push({$skip: skip});
  aggregate.push({$limit: 5});  
  aggregate.push({$project:{
    "Match._id": 1, 
    "Combo":{
      "_id": 1,
      "StartTime" :1,
      "EndTime": 1
    },
    "ContentType": 1
  }})

  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
  })
}

function getComboVideo(req, res) {
  var comboUrl =  req.params.url;

  var aggregate = [
    {
      '$match': {
          'Url': comboUrl
      }
    },
    {
      '$lookup': {
        'from': 'games', 
        'localField': 'GameId', 
        'foreignField': '_id', 
        'as': 'Game'
      }
    }, 
    {
      '$unwind': '$Game'
    }, 
    {
      '$lookup': {
        'from': 'creators', 
        'localField': 'ContentCreatorId', 
        'foreignField': '_id', 
        'as': 'ContentCreator'
      }
    }, 
    {
      '$unwind': {
        'path': '$ContentCreator', 
        'preserveNullAndEmptyArrays': true
      }
    },

  ];

  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
    aggregate = [];
  })
}

function getMatchVideo(req, res) {
  var matchUrl =  req.params.url;

  var aggregate = [
    {
      '$match': {
          'Url': matchUrl
      }
    },
    {
      '$lookup': {
        'from': 'games', 
        'localField': 'GameId', 
        'foreignField': '_id', 
        'as': 'Game'
      }
    }, 
    {
      '$unwind': '$Game'
    }, 
    {
      '$lookup': {
        'from': 'creators', 
        'localField': 'ContentCreatorId', 
        'foreignField': '_id', 
        'as': 'ContentCreator'
      }
    }, 
    {
      '$unwind': {
        'path': '$ContentCreator', 
        'preserveNullAndEmptyArrays': true
      }
    },
  ];

  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
    aggregate = [];
  })
}

// Query Videos
function getMatchupVideos(req, res) {
  var queries = [];

  var skip =  parseInt(req.query.skip);
  var aggregate = [
    {
      '$sort': 
        {'_id': -1}
      
    },
    {
      '$lookup': {
        'from': 'games', 
        'localField': 'GameId', 
        'foreignField': '_id', 
        'as': 'Game'
      }
    }, {
      '$unwind': '$Game'
    }, {
      '$lookup': {
        'from': 'matches', 
        'localField': 'Url', 
        'foreignField': 'VideoUrl', 
        'as': 'Match'
      }
    }, {
      '$unwind': {
        'path': '$Match', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$lookup': {
        'from': 'creators', 
        'localField': 'ContentCreatorId', 
        'foreignField': '_id', 
        'as': 'ContentCreator'
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team1Players.Id', 
        'foreignField': '_id', 
        'as': 'Team1Players'
      }
    }, {
      '$lookup': {
        'from': 'players', 
        'localField': 'Match.Team2Players.Id', 
        'foreignField': '_id', 
        'as': 'Team2Players'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team1Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Team1PlayerCharacters'
      }
    }, {
      '$lookup': {
        'from': 'characters', 
        'localField': 'Match.Team2Players.CharacterIds', 
        'foreignField': '_id', 
        'as': 'Team2PlayerCharacters'
      }
    }, {
      '$unwind': {
        'path': '$ContentCreator', 
        'preserveNullAndEmptyArrays': true
      }
    }, {
      '$addFields': {
        'Id': '$_id'
      }
    }
  ];
  var character1 = ObjectId(req.query.character1);
  var character2 = ObjectId(req.query.character2);
  queries.push({
      $and: [
        {"Team1PlayerCharacters": { '$elemMatch': { '_id':  character1 } }},
        {"Team2PlayerCharacters": { '$elemMatch': { '_id':  character2 } }}
      ]
  })

  queries.push({
      $and: [
        {"Team1PlayerCharacters": { '$elemMatch': { '_id':  character2 } }},
        {"Team2PlayerCharacters": { '$elemMatch': { '_id':  character1 } }}
      ]
  })

  aggregate.push({$match: {$or: queries}});

  aggregate.push({$skip: skip});
  aggregate.push({$limit: 5});  
  
  Video.aggregate(aggregate, function (error, videos) {
    if (error) { console.error(error); }
    res.send({
      videos: videos
    })
  })
}





module.exports = {  addVideo, queryVideo, queryVideoByCharacter, queryVideoByPlayer, queryVideoByGame, getVideo, patchVideo, deleteVideo, getVideos, getComboVideo, getMatchVideo, getMatchupVideos, fetchVideos}