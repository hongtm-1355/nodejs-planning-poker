const common = require('../utils/common')
const gameModel = require('../models/game.model')
const localStorage = require('../utils/store').localStorage

exports.index = (req, res, next) => {
  console.log(localStorage.getItem('rooms'))
  res.render('game/newGame')
}

exports.play = (req, res, next) => {
  const IdGame = req.params.id
  const userName = req.query.userName
  console.log(req.query)
  const game = gameModel.findById(IdGame)
  if (game) res.render('game/playGame', { gameName: game.roomName })
  else res.redirect('/new-game');
}

exports.newGame = (req, res, next) => {
  const id = common.makeid(15)
  gameModel.createGame(id, req.body.game_name)


  res.redirect('new-game/play/' + id);
}
