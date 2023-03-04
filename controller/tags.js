var Tag = require("../models/tags");

// Fetch all Tag
function getTags(req, res) {
  Tag.find({}, 'TagName', function (error, tags) {
    if (error) { console.error(error); }
    res.send({
      tags: tags
    })
  }).sort({ _id: -1 })
}

// Add new Tag
function addTag(req, res) {
  var db = req.db;
  var TagName = req.body.TagName;

  var new_tag = new Tag({
    TagName: TagName
  })

  new_tag.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Tag saved successfully!'
    })
  })
}

module.exports = { getTags, addTag}