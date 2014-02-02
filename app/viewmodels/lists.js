﻿define(function (require) {
	'use strict';
	
	var system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		message = require('factor/message'),
		moment = require('moment'),
		viewModel = function() {
			var self = this;
			self.activate = function () {
				list.getAll()
					.done(function(response){
						if (response.success) {
							self.lists(response.lists);
						}else{
							app.showMessage(response.message);
						}
					});
			};
			self.lists = ko.observableArray();
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
		};
    return viewModel;
});