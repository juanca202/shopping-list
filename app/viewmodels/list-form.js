define(['jquery', 'durandal/system', 'durandal/app', 'knockout', 'data/list'], function ($, system, app, ko, list) {
    'use strict';
	
	var List = function(data) {
			var data = data || {};
			this.id = ko.observable(data.id);
			this.name = ko.observable(data.name);
		},
		viewModel = function(){
			var self = this;
			self.activate = function (id) {
				if (id) {
					$.when(list.get(id), list.getItems(id))
						.done(function(list, items){
							self.list = new List(list);
							self.items(items);
						});
				}
			};
			self.save = function(){
				list.create(ko.toJS(self.list))
					.done(function(){
						location.href = '#';
					});
			};
			self.list = new List(),
			self.items = ko.observableArray();
		}
	
    return viewModel;
});