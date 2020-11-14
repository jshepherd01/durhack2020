// import modules
const express = require('express'); // for serving pages
const httplib = require('http'); // generic web server
const socketio = require('socket.io'); // websockets
const fs = require('fs'); // file system I/O

// initialise handlers
const app = express();
const http = httplib.createServer(app);
const io = socketio(http);
// const port = 80;
const port = 8080;

// length of a room code, might need changing
const roomCodeLength = 6;

let rooms = {};

function MakeRoomCode() {
    // generates a new, unique room code
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

app.use(express.static('static')); // serve some pages from static

app.get('/create', (req, res) => {
    // generate a room code, redirect to join?q=code
    let code = MakeRoomCode();
    rooms[code] = "";
    res.writeHead(302, {'Location': `/join?q=${code}`});
    res.end();
});

app.get('/join', (req, res) => {
    // if the room exists, send the appropriate file
    if (req.query.q in rooms) {
        fs.readFile('client/client.html','utf8', function(err, data) {
            if (err) throw err;
            // give the client the room code, so that they can attempt to join it
            var result = data.replace('<xml id="roomCode">XXXXXX</xml>', req.query.q);
            res.send(result);
        });
    } else {
        // if the room doesn't exist, 404 error
        res.writeHead(404);
        res.end();
    }
});

io.on('connection', (socket) => {
    // handling websocket connections
    console.log('a user connected');

    socket.on('join', (msg) => {
        // let the client join a room
        console.log(`a user confirmed code ${msg}`);
    });
    
    socket.on('disconnect', () => {
        // handle the client disconnecting
        console.log('a user disconnected');
    });
});

http.listen(port, () => {
    // start the http listener
    console.log(`Listening at localhost:${port}`);
});