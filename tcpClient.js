var sys = require('sys');
var net = require('net');

var args = process.argv.slice(2);

var server = net.connect(args[1], args[0], function() {
  server.on('data', function(data) {
    var parsed = JSON.parse(data.toString());
    console.log(parsed.data.message);
  });
});

process.openStdin().addListener("data", function(data) {
  var msg = data.toString().substr(0,data.length-1);
  server.write(JSON.stringify({
    event: 'message',
    data: {
      message: msg
    }
  }));
});