define(function (require) {
	'use strict';
	
	var system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		settings = require('models/settings'),
		shell = require('viewmodels/shell'),
		message = require('factor/message'),
		viewModel = function() {
			var self = this;
			self.activate = function () {
				self.currency(settings.getVariable('currency'));
				self.language(settings.getVariable('language'));
				shell.navGlobal(true); 
			};
			self.currency = ko.observable();
			self.language = ko.observable();
			self.rateApp = function(){
				switch(device.platform){
					case 'Android':
						window.open('market://details?id=ec.factor.gosh');
						break;
				}
			}
		};
    return viewModel;
});