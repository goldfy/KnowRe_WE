exports.route = function(app, fs){

    app.get('/', function(request, response){
        fs.readFile('documents/html/index.html', function(error, data){
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        });
    });
    
    app.get('/post', function(request, response){
        fs.readFile('documents/html/post.html', function(error, data){
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(data);
        });
    });
}
