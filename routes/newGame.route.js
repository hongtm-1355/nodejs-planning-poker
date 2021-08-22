var express = require('express')
const newGameController = require('../controllers/newGame.controller')
var router = express.Router()

router.get('/', newGameController.index)
router.get('/play/:id', newGameController.play)
router.post('/', newGameController.newGame)

module.exports = router;
