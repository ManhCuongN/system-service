const socketIO = require("socket.io");

function configureSocketIO(server) {
  const io = socketIO(server, {
    allowEIO3: true});

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
}

module.exports = configureSocketIO;
