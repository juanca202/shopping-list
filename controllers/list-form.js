(function($){
	'use strict';

	var $page = $('[data-role="page"]:last');
	var Lists = function(items){
		//Private
		var _self = this;
		
		//Public
		_self.items = ko.observableArray(items);
		_self.add = function(){
			
		}
	}
	var viewModel = {
		lists: new Lists([
			{id:1, name:'Shampoo', quantity:1},
			{id:2, name:'Sugar', quantity:2},
			{id:2, name:'Farmland Naturally Applewood Smoked Bacon, 1 lb', quantity:2}
		])
	};
	
	$page
		.on('pageinit', function(e){
			ko.applyBindings(viewModel, $page[0]);
		})
		.on('pageshow', function(e){
			debugger;
		});
})(jQuery);