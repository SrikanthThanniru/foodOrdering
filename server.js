const http = require('http');
const app = require('./index');
const { initWebSocket } = require('./utilis/Socket');

const server = http.createServer(app);

// Initialize Socket.io with the server
initWebSocket(server);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
