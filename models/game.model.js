
const { ObjectId } = require('mongodb')
const mongoConnect = require('../config/mongodb')
const crypto       = require('crypto')
const logger       = require('../config/logger')
const common       = require('../utils/common')

var rooms = [
  { roomId: 'E8ZsR7lfMGJuHE2', roomName: 'Test Zoom', connections: []}
]

var connectionsReplation = []

const hashPassword = plantText => {
  if (!plantText) return null
  const salt = crypto.randomBytes(16).toString('hex')
  return crypto.pbkdf2Sync(plantText, salt, 1000, 64, `sha512`).toString(`hex`)
}

const checkpassword = (plantText, hashText) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(plantText, salt, 1000, 64, `sha512`).toString(`hex`)
  return hashText === hash;
}

const findRoom = (roomId) => {
  console.log(roomId)
  const roomIdx = rooms.findIndex(i => i.roomId == roomId)
  if (roomId !== -1) {
    return rooms[roomIdx]
  }
  return undefined
}

const findRoomWithSocketId = (socketId) => {
  const db = mongoConnect.getDb()

  const result = db.collection('rooms').findOne({ "members.socketId": socketId })

  return result
}

const newGame = (roomName, password = null) => {
  const room = { roomId: common.makeid(10), roomName: roomName, connections: []}
  rooms.push(room)
  return room
}

const joinRoom = (roomId, user, owner=false) => {
  const roomIdx = rooms.findIndex(i => i.roomId == roomId)
  if (roomId !== -1) {
    rooms[roomIdx].connections.push(user)
    connectionsReplation.push({ socketId: user.socketId, roomId: roomId })
    return rooms[roomIdx]
  }
}

const leftRoom = (socketId) => {
  logger.warn(`SocketId: ${socketId}`)
  logger.warn(rooms)
  const conReIdx = connectionsReplation.findIndex(i => i.socketId == socketId)
  logger.warn(conReIdx)
  if (conReIdx !== -1) {
    const conRe = connectionsReplation[conReIdx]
    const userIdx = rooms[conRe.roomId].connections.findIndex(i => i.socketId == conRe.socketId)

    if (userIdx !== -1) {
      rooms[conRe.roomId].connections.splice(userIdx, 1)
      connectionsReplation.splice(conReIdx, 1)
      rooms[conRe.roomId].connections.forEach((user, idx) => {
        console.log(idx, user)
        if (idx == 0) user.owner = true
        else user.owner = false
      })
      console.log(rooms[conRe.roomId])
      return rooms[conRe.roomId]
    }
  }
}

const updateRoom = (roomId, options) => {
  const roomIdx = rooms.findIndex(i => i.roomId == roomId)
  if (roomId !== -1) {
    const cons = rooms[roomIdx].connections.map(i => i.point = options.point)
    rooms[roomIdx].connections = cons
    return rooms[roomIdx]
  }
}

const selectCard = (roomId, userId, point) => {
  const roomIdx = rooms.findIndex(i => i.roomId == roomId)
  if (roomIdx !== -1) {
    const userIdx = rooms[roomIdx].connections.findIndex(i => i.id == userId)
    if (userIdx !== -1) {
      rooms[roomIdx].connections[userIdx].point = point
      return rooms[roomIdx]
    }
  }
}

const resetCard = (roomId) => {
  const roomIdx = rooms.findIndex(i => i.roomId == roomId)
  if (roomId !== -1) {
    const cons = rooms[roomIdx].connections.map(i => i.point = null)
    rooms[roomIdx].connections = cons
    return rooms[roomIdx]
  }
}

const updateSocket = (roomId, userId, socketId) => {
  const db = mongoConnect.getDb()
  const filter = { _id: ObjectId(roomId), "members.id": userId }
  const updateDoc = { $set: { "members.$.socketId" : socketId } }
  const room = db.collection('rooms').updateOne(filter, updateDoc)

  return room
}


module.exports = {
  resetCard, selectCard, updateRoom, leftRoom, joinRoom, newGame, findRoom, updateSocket, findRoomWithSocketId
}
