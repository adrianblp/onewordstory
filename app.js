//Set up dependencies
var express = require('express');
var http = require('http');
var io = require('socket.io');
var path = require('path');
var fs = require('fs');
var port = (process.env.PORT || 9001);
var app = express();

//Set up env variables
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('Sex is not the secret'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '/static')));

//set up controllers
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
    console.log('Controller : ' + file);
    route = require('./controllers/' + file);
    route.controller(app);
  }
});

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log("Server now created");
  console.log('Server listening on port ' + app.get('port'));
});

var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client connected');
  console.log('url' + socket.handshake.url);
  socket.on('message', function(data) {
    data = data.substring(0,20).split(" ")[0];
    socket.broadcast.emit('server_message', data);
    socket.emit('server_message', data);
  });
  socket.on('disconnect', function() {
    console.log('Client disconnected');
  });
});
