var express = require('express')
const newGameController = require('../controllers/newGame.controller')
var router = express.Router()

router.get('/new-game', newGameController.index)
router.get('/play/:id', newGameController.play)
router.post('/new-game', newGameController.newGame)

module.exports = router;
