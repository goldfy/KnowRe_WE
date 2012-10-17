exports.connect = function(app, client){
    app.post('/post', function(request, response){
        var data = request.body;

        client.query('INSERT INTO board (title, writer) VALUES (?, ?)', [data.title, data.writer]);
        console.log(data);

        response.writeHead(302, {'Location': '/post'});
        response.end();        
    });
}
