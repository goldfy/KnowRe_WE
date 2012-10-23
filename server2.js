var express = require('express'),
	router = require('./modules/router'),
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

io.sockets.on('connection', function(socket){
	socket.on('getData', function(data){
		client.query("SELECT name, ranking, win, lose, draw, score_sum, final from haha ORDER BY ranking", function(error, result){
			io.sockets.emit('dataServerToClient', result);
		});
	});

	socket.on('getLogData', function(data){
		client.query("SELECT * from log", function(error, result){
			io.sockets.emit('dataServerToClientLog', result);
		});
	});

	socket.on('newPlayerInfo', function(data){
		client.query("SELECT ranking, final from haha", function(error, result){
			var zeroChecker = 0;
			var maximum = 0;

			client.query("INSERT INTO haha (_key, name, ranking) VALUES (?, ?, ?)", [data.new_key, data.new_name, 0]);

			for(var i = 0; i < result.lnegth; i++){
				if(result[i].ranking !=0){
					zeroChecker = 1;
				}
				if(result[i].ranking >= maximum){
					maximum = result[i].ranking;
				}
			}
			if(zeroChecker == 0){
				client.query("UPDATE haha set ranking=1 where _key='" + data.new_key + "'");
			}else{
				for(var i = 0; i < result.length; i++){
					if(result[i].final == 0){
						client.query("UPDATE haha set ranking=" + (maximum) + " where _key'" + data.new_key + "'");
					} else{
						client.query("UPDATE haha set ranking=" + (maximum + 1) + " where _key'" + data.new_key + "'");
					}
				}
			}
		});
	});

	socket.on('gameInfo', function(data){
		var name1, name2;

		client.query("SELECT _key, name from haha where _key='" + data.p1_key + "'", function(error, result){
			name1 = result[0].name;
		});

		client.query("SELECT _key, name from haha where _key='" + data.p2_key + "'", function(error, result){
			name2 = result[0].name;
		});


		client.query("INSERT INTO log (player1, player2, player1_score, palyer2_score) VALUES (?, ?, ?, ?)", [name1, name2, data.player1_score, data.player2_score]);
	//	console.log(name1, name2);
	});
});