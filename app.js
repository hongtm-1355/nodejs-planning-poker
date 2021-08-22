const path           = require('path')
const http           = require('http')
const sass           = require('node-sass-middleware')
const express        = require('express')
const socketio       = require('socket.io')
const logger         = require('./config/logger')
const createError    = require('http-errors')
const cookieParser   = require('cookie-parser')
const methodOverride = require('method-override')

const indexRouter   = require('./routes/index');
const newGameRouter = require('./routes/newGame.route');
const gameModel     = require('./models/game.model')

const port   = 3000
const app    = express();
const server = http.createServer(app)
const io     = socketio(server)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public')
}))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

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
app.use('/new-game', newGameRouter);

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

const users = []

io.on('connection', (socket) => {
  logger.warn('New WebSocket connection')

  socket.on('join', ({ userName, room }, callback) => {
    const newUser = { id: socket.id, userName: userName, point: null, room: room }
    logger.info('user joined', newUser.userName, room)
    users.push(newUser)
    socket.join(room)
    callback(newUser)
    // socket.emit('updateUser', users)
    // socket.broadcast.to(room).emit('updateUser', users)
    io.to(room).emit('updateUser', users)
  })

  socket.on('getUser', (callback) => {
    callback(users)
  })

  socket.on('chooseCard', ({ userId, point}, callback) => {
    const index = users.findIndex(user => user.id === socket.id)
    if (index !== -1) {
      const user = users[index]
      user.point = point

      logger.info('Choose Card', userId, point, user.room)
      logger.info('Choose User', user)
      socket.broadcast.to(user.room).emit('updateChooseCard', user)
      callback(user)
    }
  })

  socket.on('disconnect', () => {
    logger.warn('Disconnect socket')
    const index = users.findIndex(user => user.id === socket.id)
    if (index !== -1) {
      const user = users.splice(index, 1)[0]
      io.to(user.room).emit('updateUser', users)
    }
  })
})


server.listen(port, () => {
  logger.info(`Server is up on port ${port}!`)
})
