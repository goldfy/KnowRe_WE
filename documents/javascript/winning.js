


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
		for(var i = 0; i<data.length; i++){
			row = row + "<tr class='rowcomponent'>" +
			"<td class='rowcomponent'>"+data[i].ranking+"</td>" +
			"<td class='rowcomponent'>"+data[i].name+"</td>" +
			"<td class='rowcomponent'>"+data[i].win+"</td>" +
			"<td class='rowcomponent'>"+data[i].lose+"</td>" +
			"<td class='rowcomponent'>"+data[i].draw+"</td>" +
			"<td class='rowcomponent'>"+data[i].score_sum+"</td>" +
			"<td class='rowcomponent'>"+data[i].final+"</td>" +
			"</tr>";
		}
		$(".rowcomponent").remove();
		$(row).appendTo("#scoretablebody");
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
			"p1_score": $("#p1_score").val(),
			"p2_score": $("#p2_score").val(),
			"p2_key": $("#p2_key").val()
		};

		if(obj.p1_key=="" || obj.p1_score=="" || obj.p2_key=="" || obj.p2_score=="" ){
			alert("빈칸에 정보 쓰세요ㅡㅡ");
		}else{
			thatsocket.emit('gameInfo', obj);

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
