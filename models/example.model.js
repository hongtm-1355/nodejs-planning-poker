
const { ObjectId } = require('mongodb')
const mongoConnect = require('../config/mongodb')
const crypto       = require('crypto')
const logger       = require('../config/logger')




// var rooms = [
//   { roomId: 'E8ZsR7lfMGJuHE2', roomName: 'Test Zoom', connections: []}
// ]

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

const findRoom = async (roomId) => {
  const db = mongoConnect.getDb()

  const result = await db.collection('rooms').findOne({ _id: ObjectId(roomId)})

  return result
}

const findRoomWithSocketId = async (socketId) => {
  const db = mongoConnect.getDb()

  const result = await db.collection('rooms').findOne({ "members.socketId": socketId })

  return result
}

const newGame = async (roomName, password = null) => {
  const db = mongoConnect.getDb()

  const result = await db.collection('rooms').insertOne({
    roomName: roomName,
    members: [],
    owner: null,
    password: hashPassword(password)
  })

  return result
}

const joinRoom = (roomId, user, owner=false) => {
  const db = mongoConnect.getDb()
  const filter = { _id: ObjectId(roomId) }
  const ownerID = owner ? user.id : null

  const updateDoc = { $set: { owner: ownerID }, $push: { members: user } }
  return db.collection('rooms').updateOne(filter, updateDoc)
}

const leftRoom = async (socketId) => {
  const db = mongoConnect.getDb()
  const filter = { "members.socketId": socketId }
  const updateDoc = { $pull: { members: { socketId: socketId } } }
  const room = await db.collection('rooms').updateOne(filter, updateDoc)
  return room
}

const updateRoom = async (roomId, options) => {
  const db = mongoConnect.getDb()
  const filter = { _id: ObjectId(roomId) }
  const updateDoc = { options }
  const room = await db.collection('rooms').updateOne(filter, updateDoc)
  return room
}

const selectCard = async (roomId, userId, point) => {
  const db = mongoConnect.getDb()
  const filter = { _id: ObjectId(roomId), "members.id": userId }
  const updateDoc = { $set: { "members.$.point" : point } }
  const room = await db.collection('rooms').updateOne(filter, updateDoc)

  return room
}

const resetCard = async (roomId) => {
  const db = mongoConnect.getDb()
  const filter = { _id: ObjectId(roomId) }
  const updateDoc = { $set: { "members.$[].point" : null } }
  const room = await db.collection('rooms').updateOne(filter, updateDoc)

  return room
}

const updateSocket = async (roomId, userId, socketId) => {
  const db = mongoConnect.getDb()
  const filter = { _id: ObjectId(roomId), "members.id": userId }
  const updateDoc = { $set: { "members.$.socketId" : socketId } }
  const room = await db.collection('rooms').updateOne(filter, updateDoc)

  return room
}


module.exports = {
  resetCard, selectCard, updateRoom, leftRoom, joinRoom, newGame, findRoom, updateSocket, findRoomWithSocketId
}
