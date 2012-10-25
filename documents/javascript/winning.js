


var Winning = function() {
	this.socket = io.connect();
	this.initialize();
};

_ = Winning.prototype;

_.initialize = function() {
	this.socketEvent();
	this.bindEvent();
};

_.socketEvent = function() {
	this.socket.emit('getData', "");
	this.socket.on('dataServerToClient', function(data){
		var row;
		console.log(data);
		for(var i = 0; i<data.length; i++){
			row = row + "<tr class='rowcomponent'>" +
			"<td class='rowcomponent'>"+data[i].ranking+"</td>" +
			"<td class='rowcomponent'>"+data[i].name+"</td>" +
			"<td class='rowcomponent'>"+data[i].win+"</td>" +
			"<td class='rowcomponent'>"+data[i].lose+"</td>" +
			"<td class='rowcomponent'>"+data[i].draw+"</td>" +
			"<td class='rowcomponent'>"+data[i].goal_made+"</td>" +
			"<td class='rowcomponent'>"+data[i].goal_taken+"</td>" +
			"<td class='rowcomponent'>"+data[i].score_sum+"</td>" +
			"<td class='rowcomponent'>"+data[i].final+"</td>" +
			"<td class='rowcomponent'>"+data[i].average+"</td>" +
			"</tr>";
		}
		$(".rowcomponent").remove();
		$(row).appendTo("#scoretablebody");
	});

	this.socket.on('dataServerToClientLog', function(data){
		var row;
		console.log(data);
		for(var i = 0; i<data.length; i++){
			row = row + "<tr class='logcomponent'>" +
			"<td class='logcomponent'>"+data[i].player1+ "   " +data[i].player1_score +" : " +data[i].player2_score+"   " +data[i].player2+"</td>" +
			"<td class='logcomponent'>"+data[i].datetime+"</td>" +
			"</tr>";
		}
		$(".logcomponent").remove();
		$(row).appendTo("#logtablebody");
	});

}
	

_.bindEvent =  function(){
	var that = this;
	var thatsocket = this.socket;
	$("#show_table").click(function(){
		thatsocket.emit('getData', "");
		$("#add_result").hide();
		$("#log_table").hide();
		$("#add_page").hide();
		$("#score_table").show();
	});

	$("#show_log").click(function(){
		thatsocket.emit('getLogData', "");
		$("#add_result").hide();
		$("#score_table").hide();
		$("#add_page").hide();
		$("#log_table").show();
	});

	$("#add_player").click(function(){
		$("#add_result").hide();
		$("#score_table").hide();
		$("#log_table").hide();
		$("#add_page").show();
	});

	$("#addPlayerButton").click(function(){
		var obj = {
			"new_name": $("#new_name").val(),
			"new_key": $("#new_key").val()
		};

		if(obj.new_name=="" || obj.new_key==""){
			alert("빈칸에 정보 쓰세요ㅡㅡ");
		}else{
			thatsocket.emit('newPlayerInfo', obj);

			alert("선수정보가 성공적으로 추가되었습니다.");
			$("#new_name").val("");
			$("#new_key").val("");

			$("#add_page").hide();
			$("#score_table").show();

			thatsocket.emit('getData', "");
		}
	});	

	$("#add_game").click(function(){
		$("#add_page").hide();
		$("#score_table").hide();
		$("#log_table").hide();
		$("#add_result").show();
	});

	$("#sendGameResultButton").click(function(){
		var obj = {
			"p1_key": $("#p1_key").val(),
			"p1_score": parseInt($("#p1_score").val()),
			"p2_score": parseInt($("#p2_score").val()),
			"p2_key": $("#p2_key").val()
		};


		if(obj.p1_key=="" || obj.p1_score=="" || obj.p2_key=="" || obj.p2_score=="" ){
			alert("빈칸에 정보 쓰세요ㅡㅡ");
		}else{
			thatsocket.emit('gameInfo', obj);
			console.log(obj.p1_key.length, obj.p1_score.length, obj.p2_key, obj.p2_score);

			thatsocket.on('dataServerToClientLog', function(data){

				if(data==0){
					alert("입력하신 식별키가 존재하지 않습니다.")
				}else{
					alert("경기 결과가 성공적으로 추가되었습니다.");
					$("#p1_key").val("");
					$("#p1_score").val("");
					$("#p2_key").val("");
					$("#p2_score").val("");

					$("#add_result").hide();
					$("#score_table").show();

					thatsocket.emit('getData', "");
				}
			});

		}
	});
}