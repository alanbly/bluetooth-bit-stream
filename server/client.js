var io = require('socket.io-client'),
    ss = require("socket.io-stream"),
    BTSP = require('bluetooth-serial-port'),
    BTserial = new BTSP.BluetoothSerialPort();

var socket = io.connect('http://192.168.1.6:4444/index');
var stream = ss.createStream();
 
//ss(socket).emit('indices', stream);

var last = (new Date()).getTime(), count = 0, average = 0, next, diff;
//stream.on('data', onData);

function connect(address, channel) {
    BTserial.close();
    console.log("Connect to: ", address, channel);
    BTserial.connect(address, channel, function() {
        console.log('Connected!');

        BTserial.on('data', onData);
    }, function (err) {
        console.log('cannot connect', err);
    });
}

BTserial.listPairedDevices(function(devices) {
    console.log('Paired with: ');
    devices.forEach(function(device) {
        console.log(device);
    });
});

// 14-10-9f-de-db-2a - Ghanima
// d8-a2-5e-8a-3a-d3 - Monolith

var address = 'd8-a2-5e-8a-3a-d3'; // TODO: Connect in some intelligent way

BTserial.findSerialPortChannel(address, function(channel) {
    console.log("Serial Port: ", address, channel);
    connect(address, channel);
});

function onData(chunk) {
    next = (new Date()).getTime();
    diff = next - last;
    last = next;
    average = ((average * count) + 1.0 * chunk.length / diff) / (++count);

    if(count % 100 === 0) {
        console.log('Average rate (kBps): ', average, (new Date()).getTime());//, chunk.toString());
    }
}
