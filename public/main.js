console.log("hi");
const socket = io();

var sensitivity = 0.045;

socket.on('newdata', (data) => {
    var x_pos = false;
    var y_pos = false;
    var x_neg = false;
    var y_neg = false;
    x = data.x;
    y = data.y;
    z = data.z;
    if (Math.abs(x) > sensitivity) {
        if (x > 0) x_pos = true;
        else x_neg = true;
    }
    if (Math.abs(y) > sensitivity) {
        if (y > 0) y_pos = true;
        else y_neg = true;
    }

    if (x_pos) { console.log("x_pos!"); }
    if (y_pos) { console.log("y_pos!"); }
    if (x_neg) { console.log("x_neg!"); }
    if (y_neg) { console.log("y_neg!"); }
    if (!x_pos && !y_pos && !x_neg && !y_neg) { console.log("clear!"); }
    //console.log("x: " + x + " y: " + y + " z: " + z);
});

$loginBtn.click(() => {
    login(cleanInput($uneInput.val().trim()), cleanInput($pwdInput.val().trim()));
});