(function($){
	'use strict';

	var $page = $('[data-role="page"]:last');
	var Lists = function(items){
		//Private
		var _self = this;
		
		//Public
		_self.items = ko.observableArray(items);
		_self.add = function(){
			var item = {name:prompt('Name')};
			_self.items.push(item);
			$.mobile.changePage('list-form.html?id=1');
		}
	}
	var viewModel = {
		lists: new Lists([
			{id:1, name:'Household monthly purchases'},
			{id:2, name:'Ingredients for sushi'}
		])
	};
	
	$page.on('pageinit', function(e){
		ko.applyBindings(viewModel, $page[0]);
	});
})(jQuery);