var Player = require("../models/players");
var ObjectId = require('mongodb').ObjectId;

// Fetch all Tag
function defaultSearch(req, res) {
  var queries = [];

  if(req.query && (req.query.queryName || req.query.queryValue)){
    var value = req.query.queryValue
    
    for(var i = 0; i < value.name; i++){
      var query = {};
      query.names[i] = value;
      queries.push(query);
    }
  }

  
  Player.aggregate([
    // {$match: {$or: queries}},
    {
      $unionWith: {
        'coll': 'characters'
      }
    }, {
      $unionWith: {
        'coll': 'games'
      }
    }, {
      $unionWith: {
        'coll': 'creators'
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ], function (error, searchValues) {
    if (error) { console.error(error); }
    res.header("Access-Control-Allow-Origin", "*");
    res.send({
      searchValues: searchValues
    })
  })
}

// General Search
function getSearchValues(req, res) {
  var queries = [];
  var searchValue = req.query.value;
  var Value_match = new RegExp(searchValue, 'i');

var aggregate = [
  {
    '$unionWith': {
      'coll': 'characters'
    }
  }, {
    '$unionWith': {
      'coll': 'games'
    }
  }, {
    '$unionWith': {
      'coll': 'creators'
    }
  }
];

queries.push({'Name': {'$regex' : Value_match} });
queries.push({'Title': {'$regex' : Value_match} });

aggregate.push({$match: {$or: queries}});

Player.aggregate(aggregate, function (error, searchValues) {
  if (error) { console.error(error); }
  res.send({
    searchValues: searchValues
  })
})
}

module.exports = {getSearchValues, defaultSearch}