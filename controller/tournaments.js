var Tournament = require("../models/tournaments");

// Add new tournament
function addTournament(req, res) {
  var db = req.db;
  var Name = req.body.Name;
  var GameIds = req.body.GameIds;
  var LogoUrl = req.body.LogoUrl;
  var Date = req.body.Date;

  var new_tournament = new Tournament({
    Name: Name,
    GameIds: GameIds,
    LogoUrl: LogoUrl,
    Date: Date
  })


  new_tournament.save(function (error, tournament) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!',
      tournamentId: tournament.id
    })
  })
}

// Fetch all tournament
function getTournaments(req, res) {
  Tournament.find({}, 'Name GameIds LogoUrl Date', function (error, tournaments) {
    if (error) { console.error(error); }
    res.send({
      tournaments: tournaments
    })
  }).sort({ _id: -1 })
}

// Fetch single tournament
function getTournament(req, res) {
  var db = req.db;
  Tournament.findById(req.params.id, 'Name GameIds LogoUrl Date', function (error, tournament) {
    if (error) { console.error(error); }
    res.send(tournament)
  })
}

// Update a tournament
function updateTournament(req, res) {
  var db = req.db;
  Tournament.findById(req.params.id, 'Name GameIds LogoUrl Date', function (error, tournament) {
    if (error) { console.error(error); }

    tournament.Name = req.body.Name;
    tournament.GameIds = req.body.GameIds;
    tournament.LogoUrl = req.body.LogoUrl;
    tournament.Date = req.body.Date;

    tournament.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
}

// Delete a tournament
function deleteTournament(req, res) {
  var db = req.db;
  Tournament.remove({
    _id: req.params.id
  }, function (err, tournament) {
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
}

module.exports = { addTournament, getTournaments, getTournament, updateTournament, deleteTournament}