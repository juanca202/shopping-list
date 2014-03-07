define(function (require) {
	'use strict';
	
	var system = require('durandal/system'),
		app = require('durandal/app'),
		_key = '',
		ko = require('knockout'),
		shell = require('viewmodels/shell'),
		settings = require('models/settings'),
		message = require('factor/message'),
		ViewModel = function() {
			var self = this;
			self.activate = function(key) {	
				_key = key;
				shell.navGlobal(false); 
				self.current(settings.getVariable(_key));
				self.options([]);
				settings.getOptions(key)
					.done(function(response){
						if (response.success) {
							self.options(response.data);
						}
					});
			};
			self.current = ko.observable();
			self.format = function(item){
				var label;
				switch(_key){
					case 'language':
						label = item.name;
						break;
					case 'currency':
						label = '{0} - {1}'.format(item.code, item.name);
						break;
				}
				return label;
			};
			self.options = ko.observableArray();
			self.setOption = function(item) {
				settings.setVariable(_key, item);
				self.current(item);
				location.href = '#/settings';
				if (_key=='language') {
					location.reload();
				}
			};
			self.title = ko.observable(_('Settings'));
		},
		viewModel = new ViewModel();
    return viewModel;
});