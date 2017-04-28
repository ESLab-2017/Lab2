console.log("hi");
const socket = io();

socket.on('newdata', (data) => {
    x = data.x;
    y = data.y;
    z = data.z;
    console.log("x: " + x + " y: " + y + " z: " + z);
});