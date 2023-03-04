var Note = require("../models/notes");
var ObjectId = require('mongodb').ObjectId;

// Add new note
function addNote(req, res) {
  var db = req.db;
  var Type = req.body.Type;
  var Target1 = req.body.Target1 ? ObjectId(req.body.Target1) : null;
  var Target2 = req.body.Target2 ? ObjectId(req.body.Target2) : null;
  var Heading = req.body.Heading;
  var Content = req.body.Content;
  var AuthorId = ObjectId(req.body.AuthorId);
  var GameId = ObjectId(req.body.GameId);

  var new_note = new Note({
    Type: Type,
    Target1: Target1,
    Target2: Target2,
    Heading: Heading,
    Content: Content,    
    AuthorId: AuthorId,
    GameId: GameId
  })

  new_note.save(function (error, note) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!',
      noteId: note.id
    })
  })
}


// Query Notes
function queryNote(req, res) {
  var names = req.query.queryName.split(",");
  var values = req.query.queryValue.split(",");
  var queries = [];
  var aggregate = [];
  
  if (names.length > 0){
    for(var i = 0; i < names.length; i++){
      var query = {};
      if (names[i] === 'AuthorId') {
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
      Note.find({ $and: queries }, 'Type Target1 Target2 Heading Content CreatedAt UpdatedAt AuthorId GameId', function (error, notes) {
          if (error) { console.error(error); }
          res.send({
            notes: notes
          })
        }).sort({ _id: -1 })    
  }
  else {
    Note.find(queries[0], 'Type Target1 Target2 Heading Content CreatedAt UpdatedAt AuthorId GameId', function (error, notes) {
      if (error) { console.error(error); }
      res.send({
        notes: notes
      })
      }).sort({ _id: -1 })    
  }
  }


// Fetch all note
function getNotes(req, res) {
  Note.find({}, 'Type Target1 Target2 Heading Content CreatedAt UpdatedAt AuthorId GameId', function (error, notes) {
    if (error) { console.error(error); }
    res.send({
      notes: notes
    })
  }).sort({ _id: -1 })
}

// Fetch single note
function getNote(req, res) {
  var db = req.db;
  Note.findById(req.params.id, 'Type Target1 Target2 Heading Content CreatedAt UpdatedAt AuthorId GameId', function (error, note) {
    if (error) { console.error(error); }
    res.send(note)
  })
}

// Update a note
function updateNote(req, res) {
  var db = req.db;
  Note.findById(req.params.id, 'Type Target1 Target2 Heading Content CreatedAt UpdatedAt AuthorId GameId', function (error, note) {
    if (error) { console.error(error); }
    note.Type = req.body.Type;
    note.Target1 = req.body.Target1 ? ObjectId(req.body.Target1) : null;
    note.Target2 = req.body.Target2 ? ObjectId(req.body.Target2) : null;
    note.Heading = req.body.Heading;
    note.Content = req.body.Content;
    note.AuthorId = ObjectId(req.body.AuthorId);
    note.GameId = ObjectId(req.body.GameId)
  

    note.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
}

// Delete a note
function deleteNote(req, res) {
  var db = req.db;
  Note.remove({
    _id: req.params.id
  }, function (err, note) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
}

module.exports = { addNote, queryNote, getNotes, getNote, updateNote, deleteNote}