define(function (require) {
	'use strict';
	
	var app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		settings = require('models/settings'),
		shell = require('viewmodels/shell'),
		ViewModel = function(){
			var self = this;
				//Private vars
				
			ko.mapping = require('knockout.mapping');	
			
			//Public vars
			self.activate = function (id) {
				settings.getOptions('mass-measurement-unit')
					.done(function(response){
						if (response.success) {
							self.units(response.data);
						}
					});
				list.items.get(id)
					.done(function(response){
						if (response.success) {
							ko.mapping.fromJS(response.item, self.item);
						}
					});
				shell.navGlobal(false);
			};
			self.back = function(){
				if (self.item.lid()!=1) {
					location.href = '#lists/{0}'.format(self.item.lid());
				}else{
					location.href = '#';
				}
			};
			self.cancel = function(){
				self.back()
			};
			self.item = ko.mapping.fromJS({quantity:'', unit:'', price:''});
			self.save = function(form){
				list.items.save(ko.mapping.toJS(self.item))
					.done(function(response){
						if (response.success){
							if (self.item.lid()) {
								self.back();
							}
						}
					});
			};
			self.units = ko.observableArray();
		},
		viewModel = new ViewModel();
	
    return viewModel;
});