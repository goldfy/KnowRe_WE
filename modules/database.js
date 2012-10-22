exports.connect = function(app, client){
    app.post('/', function(request, response){
        var data = request.body;

//        client.query('INSERT INTO board (title, writer) VALUES (?, ?)', [data.title, data.writer]);
console.log("aa");

			client.query('SELECT * FROM score_table', function(error, result){
				console.log(result);
			});
//        console.log(data);

//		console.log(client);

        response.writeHead(302, {'Location': '/'});
        response.end();
    });
}