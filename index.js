var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function(){
	console.log('Connecting to port 4000');
});

app.use(express.static('public'));

var io = socket(server);
var listausuarios=[];
var x=0;
io.on('connection', function(socket){
	//console.log('Hay una conexion', socket.id); 
	socket.on('tablero', function(data){
		console.log(data);
		io.sockets.emit('tablero', data);
	}); 
	socket.on('usuarios', function(data){
		console.log(data);
		listausuarios[x++]=data;
		io.sockets.emit('usuarios', listausuarios);
	});
});