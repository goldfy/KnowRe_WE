
/**
 * Module dependencies.
 */


/*
    Call all modules
*/
var express = require('express'),
    router = require('./modules/router'),
    database = require('./modules/database'),
    http = require('http'),
    path = require('path'),
    mysql = require('mysql'),
    fs = require('fs'),
    app = express();

/*
    set the database data and record
*/
var client = mysql.createClient({
    host: '127.0.0.1',
    user: 'user1',
    password: 'aaa123',
    database: 'bulletin_board'
});

/*
    set the database data and record
*/
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  router.route(app, fs);
  database.connect(app, client);
});

/*
    set the database data and record
*/
app.configure('development', function(){
  app.use(express.errorHandler());
});
 
/*
    set the database data and record
*/
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});