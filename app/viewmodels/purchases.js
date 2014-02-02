define(function (require) {
	'use strict';
	
	var system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		purchase = require('models/purchase'),
		message = require('factor/message'),
		moment = require('moment'),
		viewModel = function() {
			var self = this;
			self.activate = function () {					
				purchase.getAll({limit:5})
					.done(function(response){
						if (response.success) {
							self.purchases(response.purchases);
						}else{
							app.showMessage(response.message);
						}
					});
			};
			self.purchases = ko.observableArray();
		};
    return viewModel;
});