var io = require("socket.io").listen(4444),
    ss = require("socket.io-stream"),
    crypto = require('crypto'),
    BTSP = require('bluetooth-serial-port'),
    BTserial = new BTSP.BluetoothSerialPort();

function randomValueBase64 (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

var Readable = require('stream').Readable;
var util = require('util');
util.inherits(Counter, Readable);

function Counter(opt) {
    Readable.call(this, opt);
    this._max = 1000000;
    this._index = 1;
}

Counter.prototype._read = function() {
    var i = this._index++;
    if (i > this._max)
        this.push(null);
    else {
        var str = randomValueBase64(2534400);
        var buf = new Buffer(str, 'utf8');
        this.push(buf);
    }
};

io.of('/index').on('connection', function(socket) {
    console.log('on.connection');
    ss(socket).on('indices', function(stream) {
        console.log('on.indices');
        (new Counter()).pipe(stream);
    });
});

function connect(address, channel) {
    findSerial(address)
    console.log("Connect to: ", address, channel);
    BTserial.connect(address, channel, function() {
        console.log('Connected!');

        var str = randomValueBase64(2534400);
        BTserial.write(new Buffer(str, 'utf-8'), function(err, bytesWritten) {
            console.log('Wrote: ', bytesWritten);
            if (err) {
                console.log(err);
            }
        });

        BTserial.on('data', function(buffer) {
            console.log(buffer.toString('utf-8'));
        });
    }, function (err) {
        console.log('cannot connect', err);
        setTimeout(function() {connect(address, channel)}, 1000);
    });
}

// 14-10-9f-de-db-2a - Ghanima

var address = '14-10-9f-de-db-2a'; // TODO: Connect in some intelligent way
var channel = 3; //devices[2].services[0].channel;

connect(address, channel);

function findSerial(address) {
    BTserial.listPairedDevices(function(devices) {
        console.log('Paired with: ');
        devices.forEach(function(device) {
            console.log(device);
        });

        BTserial.findSerialPortChannel(address, function(channel) {
            console.log("Serial Port: ", address, channel);
            //setTimeout(function() {findSerial(address);}, 1000);
        });
    });
}




