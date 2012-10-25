var Shuttle = function(selector) {
	this.selector = selector;
	this.divId = this.selector.substr(1);

	this.initialize();
};

_ = Shuttle.prototype;

_.initialize = function() {
	this.wrapper = new Shuttle.Wrapper(this);
	this.scrollbar = new Shuttle.Scrollbar(this);
	this.refresh(this);
	this.bindEvents();
};

_.getJqObj = function() {
	return $(this.selector);
};

_.refresh = function() {
	this.scrollbar.refresh(this);
};

_.bindEvents = function() {
	var that = this;

	this.getJqObj().hover(
		function(e) {
			that.scrollbar.show(that);
		},
		function(e) {
			that.scrollbar.hide(that);
		}
	);





	this.getJqObj().bind("mousewheel", function(e) {
		that.wrapper.scroll(-e.originalEvent.wheelDelta);
		that.refresh(that);
	});

	this.getJqObj().keydown(function(e) {
		switch(e.which) {
			case 38:
				that.wrapper.scroll(-30);
				break;
			case 40:
				that.wrapper.scroll(30);
				break;
			case 33:
				that.wrapper.scrollPage(true);
				break;
			case 34:
				that.wrapper.scrollPage(false);
				break;
			case 32:
				that.wrapper.scrollPage(e.shiftKey);
				break;
		}
		that.refresh(that);
	});

	$(this).bind("scrollMove", function(e, px){
		that.wrapper.scroll(px);
	})

	$(this).bind("scrollShow", function(e){
		that.scrollbar.show(that);
	})

	$(this).bind("scrollHide", function(e){
		that.scrollbar.hide(that);
	})
};


Shuttle.Scrollbar = function(shuttle) {
	this.initialize(shuttle);
};

_ = Shuttle.Scrollbar.prototype;

_.initialize = function(shuttle) {
 	this.initJqObj(shuttle);
// 	this.getJqWrapper().appendTo(shuttle.getJqObj());
	this.getJqScrollArea().appendTo(shuttle.getJqObj());
	this.getJqObj().appendTo(shuttle.getJqObj());

 	this.bindEvents(shuttle);
} ;

_.initJqObj = function(shuttle) {
	var jqObj = $("<div id='shuttleScrollbar" + shuttle.divId + "' class='shuttleScrollbar' />"),
		jqWrapper = $("<div id='shuttleScrollbarWrapper" + shuttle.divId + "' class='shuttleScrollbarWrapper' />"),
		jqScrollArea = $("<div id='shuttleScrollbarArea" + shuttle.divId + "' class='shuttleScrollbarArea' />");

	this.jqObj = jqObj;
	this.jqWrapper = jqWrapper;
	this.jqScrollArea = jqScrollArea;
};

_.getJqObj = function() {
	return this.jqObj;
};

_.getJqWrapper = function() {
	return this.jqWrapper;
};

_.getJqScrollArea = function() {
	return this.jqScrollArea;
};

_.bindEvents = function(shuttle) {
	var that = this,
		wrapper = shuttle.wrapper,
		delta,
		preTop,
		px;

	this.getJqObj().mousedown(function(e) {
		that.mousedown = true;
		that.mouseCoord = e.pageY;

		that.getJqWrapper().show();
		that.getJqWrapper().appendTo($("body"));

		that.getJqWrapper().mousemove(function(){
			$(shuttle).trigger("scrollShow");

			that.getJqWrapper().mouseup(function(){
				$(shuttle).trigger("scrollHide");
			});
		});



	});

	$("*").mouseup(function(e) {
		that.mousedown = false;
		that.getJqWrapper().remove();
	});

	$("*").mousemove(function(e) {
		if(that.mousedown) {
			delta = e.pageY - that.mouseCoord;
			px = delta / (wrapper.getViewHeight() - that.calculateHeight(shuttle)) * (wrapper.getOrigHeight() - wrapper.getViewHeight());
			preTop = that.calculateTop(shuttle);
			that.getJqObj().css("top", preTop + delta);
			$(shuttle).trigger("scrollMove", [px]);
			that.mouseCoord = e.pageY;
		}
	});

	this.getJqScrollArea().click(function(e) {
		if(e.offsetY < that.calculateTop(shuttle)) {
			shuttle.wrapper.scrollPage(true);
			shuttle.refresh();
		} else if(e.offsetY > that.calculateHeight(shuttle)) {
			shuttle.wrapper.scrollPage(false);
			shuttle.refresh();
		}

	});
};

_.refresh = function(shuttle) {
	this.getJqObj().css("top", this.calculateTop(shuttle) + "px");
	this.getJqObj().css("height", this.calculateHeight(shuttle) + "px");
};

_.show = function(shuttle) {
	this.refresh(shuttle);
	this.getJqObj().show();
	this.getJqScrollArea().show();
};

_.hide = function(shuttle) {
	this.getJqObj().hide();
	this.getJqScrollArea().hide();
};

_.calculateTop = function(shuttle) {
	var wrapper = shuttle.wrapper,
		viewHeight = wrapper.getViewHeight(),
		origHeight = wrapper.getOrigHeight(),
		viewScroll = wrapper.getScroll();

	return (viewHeight - this.calculateHeight(shuttle)) * viewScroll / (origHeight - viewHeight);
};

_.calculateHeight = function(shuttle) {
	var wrapper = shuttle.wrapper,
		viewHeight = wrapper.getViewHeight(),
		origHeight = wrapper.getOrigHeight();

	if(viewHeight >= origHeight) {
		return 0;
	} else {
		return (viewHeight - 16) * viewHeight / origHeight;
	}
};



Shuttle.Wrapper = function(shuttle) {
	this.initialize(shuttle);
};

_ = Shuttle.Wrapper.prototype;

_.initialize = function(shuttle) {
	this.origHTML = shuttle.getJqObj().html();

	shuttle.getJqObj().html("");
	this.initJqObj(shuttle);
	this.getJqObj().appendTo(shuttle.getJqObj());
};

_.initJqObj = function(shuttle) {
	var jqObj = $("<div id='shuttleWrapper" + shuttle.divId +"' class='shuttleWrapper' tabindex='0' />"),
		jqContent = $("<div id='shuttleContent" + shuttle.divId + "' class='shuttleContent' />");

	jqContent.html(this.origHTML);
	jqContent.appendTo(jqObj);

	this.jqObj = jqObj;
	this.jqContent = jqContent;
};

_.getScroll = function() {
	return this.getJqObj().scrollTop();
};

_.getJqObj = function() {
	return this.jqObj;
};

_.getJqContent = function() {
	return this.jqContent;
};

_.getOrigHeight = function() {
	return this.getJqContent().innerHeight();
};

_.getViewHeight = function() {
	return this.getJqObj().innerHeight();
};

_.scroll = function(px) {
	var origScroll = this.getJqObj().scrollTop();

	this.getJqObj().scrollTop(origScroll + px);
};

_.scrollPage = function(flag) {
	if(flag) {
		this.scroll(-this.getViewHeight());
	} else {
		this.scroll(this.getViewHeight());
	}
};