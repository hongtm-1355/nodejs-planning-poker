
const localStorage = require('../utils/store').localStorage

var rooms = [
  { roomId: 'E8ZsR7lfMGJuHE2', roomName: 'Test Zoom', connections: []}
]

// todo zoom data

exports.createGame = (id, roomName) => {
  rooms.push({ roomId: id, roomName: roomName, password: null, connections: [
    {id: 1, name: 'hong', point: null}
  ]})
  // localStorage.setItem('rooms', rooms)
}

exports.findById = (roomId) => {
  // console.log(rooms)
  const idx = rooms.findIndex(i => i.roomId == roomId)
  if (idx != -1) return rooms[idx]
  return null
}


exports.getUsers = (roomId) => {
  const idx = rooms.findIndex(i => i.roomId == roomId)
  if (idx != -1) return rooms[idx].connections
  return []
}

exports.joinGame = (roomId, user) => {
  const idx = rooms.findIndex(i => i.roomId == roomId)
  if (idx != -1) rooms[idx].connections.push(user)
}

exports.removeUser = (roomId, userId) => {
  const idx = users.findIndex(i => i.roomId == roomId)
  if (idx != -1) {
    const userIdx = rooms[idx].connections.findIndex(i => i.id == userId)
    if (userIdx != -1) rooms[idx].connections.splice(userIdx, 1)
  }
}

exports.updatePoint = (id, point) => {
  const idx = users.findIndex(x => x.id == id)
  users[idx].point = point
}

exports.resetGame = (id) => {
  users = users.map(i => i.point = null)
}
