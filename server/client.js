var io = require('socket.io-client');
var ss = require("socket.io-stream");

var socket = io.connect('http://localhost:4444/index');
var stream = ss.createStream();
 
ss(socket).emit('indices', stream);

var last = (new Date()).getTime(), count = 0, average = 0, next, diff;
stream.on('data', function(chunk) {
    next = (new Date()).getTime();
    diff = next - last;
    last = next;
    average = ((average * count) + 1.0 * chunk.length / diff) / (++count);

    if(count % 100 === 0) {
        console.log('Average rate: ', average, (new Date()).getTime());//, chunk.toString());
    }
});

// stream.on('readable', function() {
//     console.log('readable');
//     var chunk, strings = [];
//     while (null !== (chunk = stream.read())) {
//         strings.push(chunk)
//     }
//     console.log(strings.join(', '));
// });
