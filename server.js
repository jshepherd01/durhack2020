const express = require('express');
const httplib = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const app = express();
const http = httplib.createServer(app);
const io = socketio(http);
// const port = 80;
const port = 8080;

const roomCodeLength = 6;

let rooms = {};

function MakeRoomCode() {
    do {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for (var i=0; i < roomCodeLength; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    } while (result in rooms);
    return(result);
}

app.use(express.static('static'));

app.get('/create', (req, res) => {
    let code = MakeRoomCode();
    rooms[code] = "";
    fs.readFile('client/client.html','utf8', function(err, data) {
        if (err) throw err;
        var result = data.replace('<xml id="roomCode">XXXXXX</xml>', code);
        res.send(result);
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('code confirm', (msg) => {
        console.log(`a user confirmed code ${msg}`);
    });
    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

http.listen(port, () => {
    console.log(`Listening at localhost:${port}`);
});