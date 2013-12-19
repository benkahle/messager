var net = require('net');
var path = require('path');
var express = require('express');
var chatServer = require('chat-server');
var _ = require('underscore');

var app = express();
var http = require('http').createServer(app);
var io = require('socket.io');
var q = require('q');

var args = process.argv.slice(2);

var server = chatServer.createServer({
  httpServer: http,
  tcpHost: args[0],
  tcpPort: args[1]
});

server.start();

var mgr = chatServer.createManager();

server.on('client connected', function(socket) {
  var client = chatServer.transformSocket(socket);
  var dfd = q.defer();
  client.emit('message', {
    message: "Hello! Enter password to connect:"
  });

  client.on('message', function(data) {
    if (data.message.trim()==='guest 123') {
      dfd.resolve();
    }
  });
  dfd.promise.then(function() {
    mgr.add(client);
    client.broadcast('message', {
      message: 'Someone connected'
    });
  })  
});

mgr.on('client message', function(data) {
  data.client.broadcast('message', data.data);
});

app.use(express.static(path.join(__dirname, 'public')));
http.listen(args[2]);

// http.listen(80);
// io.sockets.on('connection', function(socket) {
//   socket.emit('message', 'hi there client');
//   socket.on('message', function(data) {
//     console.log('Data from socket.io client: '+ data);
//   })
// })

// var server = net.Server();
// server.listen(3000, 'localhost');

// server.on('connection', function(socket) {
//   socket.write("Hello Client");
//   socket.on('data', function(data) {
//     console.log("Data from client: " + data);
//   });
// // });

// setTimeout(function(){
//   var connection = net.connect(3000, 'localhost', function() {
//     connection.write("Hi Server");
//     // setInterval(function() {
//     //   connection.write('ping');
//     // }, 2000);
//     // connection.on('data', function(data) {
//     //   console.log("Data from server: " + data);
//     // })
//   });
// },2000)

