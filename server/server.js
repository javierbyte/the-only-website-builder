var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var _ = require('lodash')

var simplediff = require('../simplediff.js')()

server.listen(8124)

var STATE = {}

console.log('STARTING!', 8124)

io.on('connection', function (socket) {
  socket.on('DELTA', function (data) {
    var room = data.room
    var delta = data.delta

    STATE[room] = simplediff.patch(STATE[room], data.delta)

    socket.broadcast.to(room).emit('UPDATE', {
      delta: data.delta
    })
  })

  socket.on('JOINROOM', function (room) {
    console.info('\n\nJOINROOM\n', room)

    socket.join(room)

    if (!STATE[room]) {
      STATE[room] = {
        blocks: {},
        order: []
      }
    }

    socket.emit('INITIAL', {
      blocks: STATE[room].blocks,
      order: STATE[room].order
    })
  })
})
