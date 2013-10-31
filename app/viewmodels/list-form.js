define(['jquery', 'durandal/system', 'durandal/app', 'knockout', 'models/list'], function ($, system, app, ko, list) {
    'use strict';
	
	var List = function(data) {
			var data = data || {};
			this.id = ko.observable(data.id);
			this.name = ko.observable(data.name);
		},
		ViewModel = function(){
			var self = this;
			self.activate = function (id) {
				if (id && id.indexOf('temp')==-1) {
					$.when(list.get(id), list.getItems(id))
						.done(function(list, items){
							self.list = new List(list);
							self.items(items);
						});
				}else{
					if (self.tlid()!=id) {
						self.list = new List(list);
						self.items([]);
					}
					self.tlid = ko.observable(id);
				}
			};
			self.save = function(){
				list.create(ko.toJS(self.list))
					.done(function(){
						location.href = '#';
					});
			};
			self.tlid = ko.observable();
			self.list = new List();
			self.items = ko.observableArray();
		},
		viewModel = new ViewModel();
	
	app.on('list-item:select').then(function(item){
		viewModel.items.push($.extend({quantity:1}, item));
	});
	
    return viewModel;
});