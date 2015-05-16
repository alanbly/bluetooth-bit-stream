var io = require('socket.io-client'),
    ss = require("socket.io-stream"),
    BTSP = require('bluetooth-serial-port'),
    BTserial = new BTSP.BluetoothSerialPort();

var socket = io.connect('http://192.168.1.6:4444/index');
var stream = ss.createStream();
 
ss(socket).emit('indices', stream);

var last = (new Date()).getTime(), count = 0, average = 0, next, diff;
stream.on('data', function(chunk) {
    next = (new Date()).getTime();
    diff = next - last;
    last = next;
    average = ((average * count) + 1.0 * chunk.length / diff) / (++count);

    if(count % 100 === 0) {
        console.log('Average rate (kBps): ', average, (new Date()).getTime());//, chunk.toString());
    }
});

function connect(address, channel) {
    if(channel > 30) return;
    BTserial.close();
    console.log("Connect to: ", address, channel);
    BTserial.connect(address, channel, function() {
        console.log('Connected!');

        var str = randomValueBase64(2534400);
        BTserial.write(new Buffer(str, 'utf-8'), function(err, bytesWritten) {
            console.log('Wrote: ', bytesWritten);
            if (err) {
                console.log(err);
                //connect(address, channel+1);
            }
        });

        BTserial.on('data', function(buffer) {
            console.log(buffer.toString('utf-8'));
        });
    }, function (err) {
        console.log('cannot connect', err);
        //connect(address, channel+1);
    });
}

BTserial.listPairedDevices(function(devices) {
    console.log('Paired with: ');
    devices.forEach(function(device) {
        console.log(device);
    });
});

// 14-10-9f-de-db-2a - Ghanima

var address = '14-10-9f-de-db-2a'; // TODO: Connect in some intelligent way
var channel = channel; //devices[2].services[0].channel;

//connect(address, channel);
