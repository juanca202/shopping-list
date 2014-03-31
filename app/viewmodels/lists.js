define(function (require) {
	'use strict';
	
	var system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		message = require('factor/message'),
		moment = require('moment'),
		shell = require('viewmodels/shell'),
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
				shell.navGlobal(true); 
			};
			self.lists = ko.observableArray();
			self.create = function() {
				message.prompt(_('Enter a name')).done(function(name){
					if (name) {
						list.save({name:name}).done(function(response){
							if (response.success) {
								if (window.plugins && typeof window.plugins.gaPlugin!='undefined') {
									window.plugins.gaPlugin.trackEvent(function(result){
										//alert('gaPlugin: '+result);
										//console.log('gaPlugin: '+result);
									}, function(error){
										//alert('gaPlugin: '+error);
										system.log('gaPlugin: '+error);
									}, "Lists", "create");
								}
								location.href = '#/lists/{0}'.format(response.id);
							}
						});
					}
				});
			};
			self.router = require('plugins/router');
			self.update = function(item){
				location.href = '#lists/{0}'.format(item.id);
			};
		};
    return viewModel;
});