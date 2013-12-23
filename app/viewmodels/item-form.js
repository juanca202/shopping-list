define(function (require) {
	'use strict';
	var app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		settings = require('models/settings'),
		ViewModel = function(){
			var self = this,
				//Private vars
				emptyItem = {unit:'', quantity:'', price:''};
				
			ko.mapping = require('knockout.mapping');	
			
			//Public vars
			self.activate = function (id) {
				settings.getOptions('units')
					.done(function(response){
						if (response.success) {
							ko.mapping.fromJS(response.values, self.units);
						}
					});
				list.items.get(id)
					.done(function(response){
						if (response.success) {
							ko.mapping.fromJS(response.item, self.item);
						}
					});
			};
			self.cancel = function(){
				location.href = '#lists/{0}'.format(self.item.lid());
			};
			self.item = ko.mapping.fromJS(emptyItem);
			self.save = function(form){
				list.items.save(ko.mapping.toJS(self.item))
					.done(function(response){
						if (response.success){
							if (self.item.lid()) {
								location.href = '#lists/{0}'.format(self.item.lid());
							}
						}
					});
			};
			self.units = ko.mapping.fromJS([]);
		},
		viewModel = new ViewModel();
	
    return viewModel;
});