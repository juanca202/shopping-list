define(function (require) {
	'use strict';
	
	var app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		settings = require('models/settings'),
		ViewModel = function(){
			var self = this;
				//Private vars
				
			ko.mapping = require('knockout.mapping');	
			
			//Public vars
			self.activate = function (id) {
				settings.getOptions('units')
					.done(function(response){
						if (response.success) {
							self.units(response.values);
						}
					});
				list.items.get(id)
					.done(function(response){
						if (response.success) {
							self.item(response.item);
						}
					});
			};
			self.cancel = function(){
				location.href = '#lists/{0}'.format(self.item().lid);
			};
			self.item = ko.observable();
			self.save = function(form){
				list.items.save(ko.mapping.toJS(self.item()))
					.done(function(response){
						if (response.success){
							if (self.item().lid) {
								location.href = '#lists/{0}'.format(self.item().lid);
							}
						}
					});
			};
			self.units = ko.observableArray();
		},
		viewModel = new ViewModel();
	
    return viewModel;
});