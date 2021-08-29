const path           = require('path')
const http           = require('http')
const sass           = require('node-sass-middleware')
const express        = require('express')
const socketio       = require('socket.io')
const logger         = require('./config/logger')
const createError    = require('http-errors')
const cookieParser   = require('cookie-parser')
const methodOverride = require('method-override')

const indexRouter    = require('./routes/index');
const newGameRouter  = require('./routes/newGame.route');
const mongoConnect   = require('./config/mongodb')
const gameModel      = require('./models/game.model')
const { Hmac } = require('crypto')


const port   = 3000
const app    = express();
const server = http.createServer(app)
const io     = socketio(server)


mongoConnect.connectToServer( function( err, client ) {
  if (err) logger.error(err);
} );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// https://philipm.at/2017/method-override_in_expressjs.html
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use('/', indexRouter);
app.use('/game', newGameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


io.on('connection', (socket) => {
  logger.warn('New WebSocket connection')

  socket.on('join', async ({ player, roomId }, callback) => {
    logger.info(`[${socket.id}]${player.name} user joined room: ${roomId}`)
    try {
      const userId = player.id
      const room = gameModel.findRoom(roomId)
      var user = { id: userId || socket.id, name: player.name, point: null }
      var result = room

      if (room.connections.length == 0) {
        user = { id: userId || socket.id, name: player.name, point: null, socketId: socket.id, owner: true }
        result = gameModel.joinRoom(roomId, user, true)
      } else if (!room.connections.map(i => i.id).includes(userId)) {
        user = { id: userId || socket.id, name: player.name, point: null, socketId: socket.id, owner: false }
        result = gameModel.joinRoom(roomId, user, false)
      } else {
        // gameModel.updateSocket(roomId, userId, socket.id)
      }

      socket.join(roomId)
      logger.info(user)
      callback(user)
      // socket.emit('updateUser', users)
      // socket.broadcast.to(room).emit('updateUser', users)
      logger.info(result)

      io.to(roomId).emit('updateUser', result.connections || [])
    } catch (error) {
      logger.error(error)
    }
  })

  socket.on('getUser', async (roomId, callback) => {
    const room = gameModel.findRoom(roomId)
    callback(room.connections)
  })

  socket.on('chooseCard', ({ roomId, point, userId}, callback) => {
    const result = gameModel.selectCard(roomId, userId, point)
    logger.info(`${userId} choose Card ${roomId} - ${point}`)
    socket.broadcast.to(roomId).emit('updateChooseCard', { id: userId, point })
    callback()
  })

  socket.on('showResult', (roomId, callback) => {
    socket.broadcast.to(roomId).emit('updateCard')
    callback()
  })

  socket.on('resetResult', (roomId, callback) => {
    socket.broadcast.to(roomId).emit('updateResetCard')
    callback()
  })

  socket.on('disconnect', async (reason) => {
    // logger.error(reason)
    logger.warn(`Disconnect socket ${socket.id}`)
    room = gameModel.leftRoom(socket.id)
    logger.error(room)
    if (room) {
      io.broadcast.to(room.id).emit('updateUser', room.connections || [])
    }
  })
})


server.listen(port, () => {
  logger.info(`Server is up on port ${port}!`)
})

process.on('SIGINT', () => {
  console.log('exiting…')
  process.exit()
})

process.on('exit', () => {
  console.log('exiting…')
  process.exit()
})
