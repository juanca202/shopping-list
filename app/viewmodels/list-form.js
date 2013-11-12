define(['jquery', 'durandal/system', 'durandal/app', 'knockout', 'models/list'], function ($, system, app, ko, list) {
    'use strict';
	
	var ViewModel = function(){
			var self = this,
				emptyList = {id:-1, name:''};
			self.activate = function (id, params) {
				self.hash(location.hash);
				self.mode(id == 'create'? 'create' : 'update');
				if (self.mode() == 'create') {
					self.empty();
				}else{
					$.when(list.get(id), list.items.getAll(id))
						.done(function(list, items){
							self.list(list);
							self.items(items);
						});
				}
			};
			self.save = function(form){
				list.save($(form).serializeObject())
					.done(function(response){
						if (response.success) {
							list.items[self.mode()](response.id, self.items())
								.done(function(){
									location.href = '#';	
								});
						}
					});
			};
			self.empty = function(){
				self.list(emptyList);
				self.items([]);
			};
			self.hash = ko.observable();
			self.mode = ko.observable('create');
			self.fid = new Date().getTime();
			self.list = ko.observable(emptyList);
			self.items = ko.observableArray([]);
			
			app.on('product:select').then(function(product){
				location.href = self.hash();
				self.items.push($.extend({id:null, pid:product.id, quantity:1}, product));
			});
		},
		viewModel = new ViewModel();
	
    return viewModel;
});