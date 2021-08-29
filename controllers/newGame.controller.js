const logger         = require('../config/logger')
const common = require('../utils/common')
const gameModel = require('../models/game.model')
const localStorage = require('../utils/store').localStorage

exports.index = (req, res, next) => {
  res.render('game/newGame')
}

exports.play = (req, res, next) => {
  const IdGame = req.params.id
  const room = gameModel.findRoom(IdGame)

  if (room) {
    res.render('game/playGame', { gameName: room.roomName })
  } else res.redirect('/game/new-game');

}

exports.newGame = (req, res, next) => {
  const game = gameModel.newGame(req.body.game_name)

  if (game) {
    res.redirect('play/' + game.roomId)
  } else res.redirect('/game/new-game')
}
