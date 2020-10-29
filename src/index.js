const express = require('express');//TOMCAT
var socket = require('socket.io');//SOCKET
const session = require('express-session');//TOMCAT SESSION
const app = express();
const path = require('path');
// Settings
app.set('port',process.env.PORT ||3000)//desplegar en el server 3000
// Middlewares
app.use(express.json());//equals to BodyParser
app.use(express.urlencoded({extended:true}));//equals to BodyParser
app.use(session({
    secret: 'Board',
    resave: false,
    saveUninitialized: true,
    /*cookie: { secure: true }*/
  }))
// Routes Server
app.use(require('./routes/products'))
app.use(require('./routes/usuarios'))
app.use(require('./routes/pizarra'))
// Routes Views
app.use(require('./views/views'))
app.use(express.static(path.join(__dirname,'public')));

//Init Server
//Open ServEr in port 3000
var server = app.listen(app.get('port'),()=>{
    console.log("server activo en el puerto",app.get('port'))
});

//socket 
var io = socket(server);
var listausuarios=[];
var x=0;
io.on('connection', function(socket){
	//console.log('Hay una conexion', socket.id); 
	socket.on('tablero', function(data){
		console.log(data);
		io.sockets.emit('tablero', data);
	}); 
	/*socket.on('usuarios', function(data){
		console.log(data);
		listausuarios[x++]=data;
		io.sockets.emit('usuarios', listausuarios);
	});*/
});



/*const express = require('express');
var socket = require('socket.io');
const app = express();

// Settings
app.set('port',process.env.PORT ||3000)//desplegar en el server 3000
// Middlewares
app.use(express.json());//equals to BodyParser
//app.use(express.static('src'));
// Routes
app.use(require('./src/routes/products'))
//Init Server
//Open Servr in port 3000
app.listen(app.get('port'),()=>{
    console.log("server activo en el puesto",app.get('port'))
});


/*var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function(){
	console.log('Connecting to port 4000');
});

// Middlewares
app.use(express.json());//equals to BodyParser
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
});*/