import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from "cors"; 

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "*",
        methods: 'GET,POST',
        credentials: true,
    }
});

const users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('set_username', (username) => {
        users[socket.id] = { username };
        io.emit('user_list', { data: Object.values(users).map(user => user.username) });
    });

    socket.on('join_room', (data) => {
        socket.join(data)
        console.log("user joined", data);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('reseve_message', data)
        console.log(data.message);
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
