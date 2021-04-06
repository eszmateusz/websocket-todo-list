const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000.');
});

app.use((req, res) => {
  res.status(404).json({message: 'Err 404 - Not found...'});
})

const io = socket(server);

io.on('connection', (socket) => {
  io.to(socket.id).emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);

    console.log('New task: ' , task , ' from client ' + socket.id);
  });

  socket.on('removeTask', (id) => {
    const searchTask = tasks.find(task => task.id === id);
    const taskIndex = tasks.indexOf(searchTask);

    console.log('Client with id - ' + socket.id + ' remove task ' + searchTask.name)

    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', id);
  });
});