const noteModel = require('../models/note.model')

exports.index = (req, res, next) => {
  const notes = noteModel.getNotes()

  res.render('notes', { data: notes })
}

exports.new = (req, res, next) => {
  res.render('notes/new')
}

exports.create = (req, res, next) => {
  noteModel.addNotes(req.body)
  res.redirect("/notes");
}

exports.destroy = (req, res, next) => {
  console.log(req.body)
  noteModel.removeNotes(req.body.title)
  res.redirect("/notes");
}

