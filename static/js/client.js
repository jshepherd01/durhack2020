// initialise the socket
var socket = io();
const editor = document.querySelector('.code-editor');

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

editor.addEventListener("input", () => {
    socket.emit('update', [roomCode, editor.value]);
});

function textChange(newText) {
    // this should be called every time the code is updated
    socket.emit('update', [roomCode, newText]);
}

socket.on('update', (msg) => {
    // replace code inside editor with msg
    editor.value = msg;
});