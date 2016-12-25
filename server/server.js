var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8124);

const BASE = [{
  type: 'HEADER',
  uuid: 0,
  meta: {
    active: true
  },
  data: {
    title: 'Header title',
    subtitle: '',
    style: {
      backgroundColor: '#222',
      color: '#fff',
      textAlign: 'center'
    },
    titleStyle: {
      fontSize: '4rem',
      fontWeight: 500
    },
    subtitleStyle: {
      fontSize: '1.4rem',
      fontWeight: 300,
      opacity: 0.85
    }
  }
}, {
  type: 'FOOTER',
  uuid: 1,
  meta: {
    active: true
  },
  data: {
    text: '©2016 Footer Text',
    style: {
      backgroundColor: '#eee',
      color: '#666',
      textAlign: 'left',
      fontSize: '1rem'
    }
  }
}]

var STATE = {}

console.log('STARTING!')

io.on('connection', function (socket) {
  socket.on('UPDATE', function (data) {
    var room = data.room
    STATE[room] = data.webdata
    socket.broadcast.to(room).emit('UPDATE', STATE[room])
  });

  socket.on('JOINROOM', function (room) {
    socket.join(room);

    if (!STATE[room]) {
      STATE[room] = JSON.parse(JSON.stringify(BASE))
    }
    console.log('Broadcasting to', room)

    io.to(room).emit('UPDATE', STATE[room]);
  });
});
