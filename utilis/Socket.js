const socketIo = require('socket.io');

let io;

const initWebSocket = (server) => {
  console.log('Initializing Socket.io');
  io = socketIo(server);
  
  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

const getIo = () => {
  if (!io) {
    console.log('Socket.io not initialized when getIo was called!');
    throw new Error('Socket.io not initialized');
  }
  console.log('Socket.io instance returned');
  return io;
};


module.exports = {
  initWebSocket,
  getIo
};
