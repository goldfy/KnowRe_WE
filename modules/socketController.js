exports.execute = function(io, client){
    var Handler,
        handler,
        _;

    Handler = function(){
        this.initialize();
    };

    _ = Handler.prototype;

    _.initialize = function(){
        this.socketEventBinder();
    }

    _.socketEventBinder = function(){
        io.sockets.on('connection', function(socket){
            socket.on('getData', function(data){
                client.query("SELECT name, ranking, goal_made, goal_taken, win, lose, draw, score_sum, final, average from haha ORDER BY ranking", function(error, result){
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
                                client.query("UPDATE haha set ranking=" + (maximum) + " where _key='" + data.new_key + "'");
                            } else{
                                client.query("UPDATE haha set ranking=" + (maximum + 1) + " where _key='" + data.new_key + "'");
                            }
                        }
                    }
                    
                });
            });

            socket.on('gameInfo', function(data){
                var length1, length2, name1, name2;

                client.query("SELECT _key, name from haha where _key='" + data.p1_key + "'", function(error, result){
                    length1 = result.length;
                    
                    if(length1 != 0){
                        name1 = result[0].name;
                    }
                });

                client.query("SELECT _key, name from haha where _key='" + data.p2_key + "'", function(error, result){
                    length2 = result.length;
                    
                    if(length2 != 0){
                        name2 = result[0].name;
                    }
                });

                client.query("SELECT * from haha where _key='" + data.p1_key + "'", function(error, player1_data){

                    client.query("SELECT * from haha where _key='" + data.p2_key + "'", function(error, player2_data){

                        if(length1 == 0 || length2 == 0){
                            console.log(3);
                            socket.emit('gameInfoKeySearchResult', 0);
                        } else {
                            client.query("INSERT INTO log (player1, player2, player1_score, player2_score) VALUES (?, ?, ?, ?)", [name1, name2, data.p1_score, data.p2_score]);
                            if(data.p1_score > data.p2_score){
                                console.log("aaa");
                                client.query("UPDATE haha set win='" + (player1_data[0].win +1) + "' where _key='" + data.p1_key + "'");
                                client.query("UPDATE haha set lose='" + (player2_data[0].lose +1) + "'  where _key='" + data.p2_key + "'");

                                client.query("UPDATE haha set final='" + (player1_data[0].final +3) + "'  where _key='" + data.p1_key + "'");



                            }else if(data.p1_score< data.p2_score){
                                console.log("bbb");
                                client.query("UPDATE haha set lose='" + (player1_data[0].lose +1) + "'  where _key='" + data.p1_key + "'");
                                client.query("UPDATE haha set win='" + (player2_data[0].win +1) + "'  where _key='" + data.p2_key + "'");

                                client.query("UPDATE haha set final='" + (player2_data[0].final +3) + "'  where _key='" + data.p2_key + "'");



                            }else{
                                console.log("ccc");
                                client.query("UPDATE haha set draw='" + (player1_data[0].draw +1) + "'  where _key='" + data.p1_key + "'");
                                client.query("UPDATE haha set draw='" + (player2_data[0].draw +1) + "'  where _key='" + data.p2_key + "'");

                                client.query("UPDATE haha set final='" + (player1_data[0].final +1) + "'  where _key='" + data.p1_key + "'");
                                client.query("UPDATE haha set final='" + (player2_data[0].final +1) + "'  where _key='" + data.p2_key + "'");


                            }


                            client.query("UPDATE haha set goal_made='" + (player1_data[0].goal_made + data.p1_score) + "'  where _key='" + data.p1_key + "'");
                            client.query("UPDATE haha set goal_taken='" + (player1_data[0].goal_taken + data.p2_score) + "'  where _key='" + data.p1_key + "'");

                            client.query("UPDATE haha set goal_made='" + (player2_data[0].goal_made + data.p2_score) + "'  where _key='" + data.p2_key + "'");
                            client.query("UPDATE haha set goal_taken='" + (player2_data[0].goal_taken + data.p1_score) + "'  where _key='" + data.p2_key + "'", function(){

                            });
                            
                            client.query("SELECT * from haha where _key='" + data.p1_key + "'", function(error, player1_data){
                               client.query("SELECT * from haha where _key='" + data.p2_key + "'", function(error, player2_data){
                                    client.query("UPDATE haha set score_sum='" + (player1_data[0].goal_made - player1_data[0].goal_taken) + "'  where _key='" + data.p1_key + "'");
                                    client.query("UPDATE haha set score_sum='" + (player2_data[0].goal_made - player2_data[0].goal_taken) + "'  where _key='" + data.p2_key + "'");    

                                    client.query("UPDATE haha set numberofgames='" + (player1_data[0].numberofgames +1) + "'  where _key='" + data.p1_key + "'");
                                    client.query("UPDATE haha set numberofgames='" + (player2_data[0].numberofgames +1) + "'  where _key='" + data.p2_key + "'");

                                    client.query("UPDATE haha set average='" + (player1_data[0].final / (player1_data[0].numberofgames + 1)) + "'  where _key='" + data.p1_key + "'");
                                    client.query("UPDATE haha set average='" + (player2_data[0].final / (player1_data[0].numberofgames + 1)) + "'  where _key='" + data.p2_key + "'");
                                });
                            });
                            //ranking 재계산
                            socket.emit('gameInfoKeySearchResult', 1);
                        }
                    });
                });
                


                
                

            });
        });

    }

    handler = new Handler();
}
