define(function (require) {
	'use strict';
	
	var system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		product = require('models/product'),
		purchase = require('models/purchase'),
		message = require('factor/message'),
		moment = require('moment'),
		viewModel = function() {
			var self = this;
			self.activate = function () {
				$.when(list.initialize(), product.initialize(), purchase.initialize()).done(function() {
					list.getAll()
						.done(function(response){
							if (response.success) {
								self.lists(response.lists);
							}else{
								app.showMessage(response.message);
							}
						});
					purchase.getAll()
						.done(function(response){
							if (response.success) {
								self.lastPurchases(response.purchases);
							}else{
								app.showMessage(response.message);
							}
						});
				});
				//TODO: get last purchases
			};
			self.lists = ko.observableArray();
			self.lastPurchases = ko.observableArray();
			self.create = function() {
				message.prompt('Enter list name').done(function(name){
					if (name) {
						list.save({name:name}).done(function(response){
							if (response.success) {
								location.href = '#/lists/{0}'.format(response.id);
							}
						});
					}
				});
			};
			self.update = function(item){
				location.href = '#lists/{0}'.format(item.id);
			};
			self.show = function(item){
				app.showDialog('viewmodels/menu', {context:item, actions:self.items});
			}
		};
    return viewModel;
});