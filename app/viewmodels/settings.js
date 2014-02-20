define(function (require) {
	'use strict';
	
	var system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		shell = require('viewmodels/shell'),
		message = require('factor/message'),
		viewModel = function() {
			var self = this;
			self.activate = function () {					
				
				shell.navGlobal(true); 
			};
		};
    return viewModel;
});