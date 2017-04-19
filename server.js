// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);

const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const ip = require('ip');

const port = process.env.PORT || 8080;

http.listen(port, () => {
    console.log(`listening on localhost:8080 and ${ip.address()}:8080`);
});

app.use(express.static(`${__dirname}/public`));

io.on('connection', (socket) => {
    // Initialize the accelerometer.
    accel.on('ready', function() {
        // Stream accelerometer data
        accel.on('data', function(xyz) {
            console.log('x:', xyz[0].toFixed(2),
                'y:', xyz[1].toFixed(2),
                'z:', xyz[2].toFixed(2));
        });

    });

    accel.on('error', function(err) {
        console.log('Error:', err);
    });
});