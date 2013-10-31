define(['plugins/http', 'durandal/app', 'knockout', 'models/product'], function (http, app, ko, product) {
	'use strict';
	
    var viewModel = function(){
			var self = this;
			self.activate = function (params) {
				if (params.id) {
					$.when(product.get(params.id))
						.done(function(product, items){
							
						});
				}
				product.getCategories().done(function(response){
					self.productCategories(response);
				});
			};
			self.save = function(form){
				product.create(ko.toJS(self.product))
					.done(function(){
						history.back();
					});
			};
			self.scan = function(){
			
			};
			self.product = {
				name: ko.observable(),
				cid: ko.observable(),
				unit: ko.observable(),
				price: ko.observable(),
				code: ko.observable(),
				picture: ko.observable()
			};
			self.productCategories = ko.observableArray();
		};
	
    return viewModel;
});