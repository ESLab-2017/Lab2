var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(`${__dirname}/public`));

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var av = require('tessel-av');
var camera = new av.Camera();

app.get('/stream', (request, response) => {
    response.redirect(camera.url);
});

accel.on('ready', function() {
    // Stream accelerometer data
    console.log('Accelerometer is ready.');
    io.on('connection', function(socket) {
        console.log('a user connected');
        // Initialize the accelerometer.
        socket.emit('newdata', {
            x: 1,
            y: 2,
            z: 3,
        });

        accel.on('data', function(xyz) {
            socket.emit('newdata', {
                x: xyz[0],
                y: xyz[1],
                z: xyz[2],
            });
            console.log('x:', xyz[0],
                'y:', xyz[1],
                'z:', xyz[2]);
        });

        accel.on('error', function(err) {
            console.log('Error:', err);
        });
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});