var Collection = require("../models/collections");
var ObjectId = require('mongodb').ObjectId;

// Query Collections
function queryCollection(req, res) {
var names = req.query.queryName.split(",");
var values = req.query.queryValue.split(",");
var queries = [];
var aggregate = [];

if (names.length > 0){
    for(var i = 0; i < names.length; i++){
      var query = {};
      if (names[i] === 'OwnerId') {
        query[names[i]] =  {'$eq': ObjectId(values[i])};
      }
      if (names[i] === 'Id') {
        query['_id'] =  {'$eq': ObjectId(values[i])};
      }
      else {
        query[names[i]] =  {'$eq': values[i]}
      }
      queries.push(query);
    }
} 
else {
    for(var i = 0; i < names.length; i++){
        var query = {};
        query[names[i]] = values[i];
        queries.push(query);
    }
}


if(queries.length > 0) {
    aggregate.push({$match: {$or: queries}});
}

if(queries.length > 0) {
    Collection.find({ $or: queries }, 'Name Videos OwnerId', function (error, collections) {
        if (error) { console.error(error); }
        res.send({
            collections: collections
        })
      }).sort({ _id: -1 })    
}
else {
    Collection.find(queries[0], 'Name Videos OwnerId', function (error, collections) {
    if (error) { console.error(error); }
    res.send({
        collections: collections
    })
    }).sort({ _id: -1 })    
}
}

function addCollection(req, res) {
    var Name = req.body.Name;
    var OwnerId = req.body.OwnerId;

    var new_collection = new Collection({
        Name: Name,
        Videos: [],
        OwnerId: OwnerId
    })

    new_collection.save(function (error,collections) {
        if (error) {
            console.log(error)
        }
        res.send({
            success: true,
            message: 'Post saved successfully!',
            collections: collections
        })
    })
}

  // Update a collection
function patchCollection(req, res) {
    Collection.findById(ObjectId(req.params.id), 'Name Videos Owner', function (error, collection) {
      if (error) { console.error(error); }
        collection.Name = req.body.Name;
        collection.Videos = req.body.Videos.map(video => {
            return {
                Id: ObjectId(video.id),
                ContentType: video.contentType
            }
        });
        collection.Owner = req.body.VideOwneroUrl;    
        
        collection.save(function (error) {
            if (error) {
                console.log(error)
            }
                res.send({
                success: true
            })
        })
    })
  }
  

// Query Collections
function getCollection(req, res) {
    var aggregate = [
        {'$sort': {'_id': -1}}
    ];
    
    aggregate.push(
        {$match: 
            {$or: 
                [{'_id': {'$eq': ObjectId(req.params.id)}}]
            }
        }
    );

    Collection.aggregate(aggregate, function (error, collection) {
        if (error) { console.error(error); }
        res.send({
            collection: collection
        })
    })

    }
  module.exports = {queryCollection, addCollection, patchCollection, getCollection}