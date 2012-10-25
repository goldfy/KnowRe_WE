var express = require('express'),
	router = require('./modules/router'),
	socketController = require('./modules/socketController'),
	http = require('http'),
	path = require('path'),
	mysql = require('mysql'),
	fs = require('fs'),
	socketio = require('socket.io'),
	app = express();

var client = mysql.createClient({
	host: '127.0.0.1',
	user: 'user1',
	password: 'aaa123',
	database: 'winning_eleven'
});

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'documents')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

var io = socketio.listen(server);

router.route(app, fs);
socketController.execute(io, client);