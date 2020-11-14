// initialise the socket
var socket = io();

// connect to a room
socket.on('connect', () => {
    socket.emit('join', roomCode);
});

socket.on('join-success', () => {
    console.log('Join Sucessful');
});

socket.on('join-fail', () => {
    console.log('Join Failed');
});