const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.static('../')); // Serve frontend files

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../community.html');
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('botMessage', 'Welcome to Midtown Community Chat!');

  socket.on('customerMessage', (msg) => {
    socket.broadcast.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server live on port ${PORT}`));
