const logger          = require('./logger')
const { MongoClient } = require('mongodb')

const databaseName = 'dev_planing_pocker'
const connectionURL = `mongodb://127.0.0.1:27017`

var _db

module.exports = {
  connectToServer: function(callback) {
    MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
      if (error) {
          return logger.error('Unable to connect to database!')
      }

      _db = client.db(databaseName)
      if (_db) logger.info('Connected to database!')
      return callback(error)
    })
  },
  getDb: function() {
    if (typeof _db === 'undefined') logger.error('DB NO has value')
    return _db
  }
}



// const { MongoClient, ObjectId } = require('mongodb')

// const connectionURL = 'mongodb://127.0.0.1:27017'
// const databaseName = 'dev_planing_pocker'

// var db
// MongoClient.connect(connectionURL, { useNewUrlParser: true }, async (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database!')
//     }

//     db = client.db(databaseName)

//     const findRoom = async (roomId) => {
//       const result = await db.collection('rooms').findOne({ _id: ObjectId('6124f65793562e61798785a3')})
//       console.log(result)
//       return result
//     }
//     findRoom()
    // console.log(findRoom())

    // {_id: ObjectId('6124f65793562e61798785a3')}

    // const ownerUser = { id: 1, userName: 'hong', point: null }
    // const newUser = { id: 2, userName: 'hong2', point: null }

    // joinRoom('6124fbd442fd3f05452b8e6c', newUser)
    // resetCard('6124fbd442fd3f05452b8e6c')
    // const room = await newGame('Test Zoom', ownerUser, "Aa@123456")
    // console.log(75, room.insertedId.toString())
    // console.log(75, '6124fbd442fd3f05452b8e6c')
    // selectCard('6124fbd442fd3f05452b8e6c', 1, 10)
    // console.log(leftRoom('6124fbd442fd3f05452b8e6c'))
    // joinRoom(room.insertedId, newUser)
// })






// joinRoom()
