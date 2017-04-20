const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const _ = require('lodash');

const simplediff = require('../simplediff.js')();

server.listen(8124);

const STATE = {};

console.log('STARTING!', 8124);

io.on('connection', function(socket) {
  socket.on('DELTA', function(data) {
    const room = data.room;
    const delta = data.delta;

    STATE[room] = simplediff.patch(STATE[room], data.delta);

    socket.broadcast.to(room).emit('UPDATE', {
      delta: data.delta
    });
  });

  socket.on('JOINROOM', function(room) {
    console.info('\n\nJOINROOM\n', room);

    socket.join(room);

    if (!STATE[room]) {
      STATE[room] = {
        blocks: {},
        order: []
      };
    }

    socket.emit('INITIAL', {
      blocks: STATE[room].blocks,
      order: STATE[room].order
    });
  });
});
