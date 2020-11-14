// initialise the socket
var socket = io();

// connect to a room
socket.on('connect', () => {
    socket.emit('join', roomCode);
});

// if they failed to join the room, redirect to the error page
socket.on('join', (msg) => {
    if (!msg) {
        window.location.href = "/error.html";
    }
});

function textChange(newText) {
    // this should be called every time the code is updated
    socket.emit('update', [roomCode, newText]);
}

socket.on('update', (msg) => {
    // replace code inside editor with msg
    console.log(msg);
});