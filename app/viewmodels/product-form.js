define(['plugins/http', 'durandal/app', 'knockout', 'models/product'], function (http, app, ko, product) {
	'use strict';
	
    var viewModel = function(){
			var self = this;
			self.activate = function (id, params) {
				if (id != 'create') {
					$.when(product.get(id))
						.done(function(product){
							self.product(product)
						});
				}else if(params) {
					self.product(params);
				}
				product.getCategories().done(function(response){
					self.productCategories(response);
				});
			};
			self.save = function(form){
				product.create(self.product())
					.done(function(response){
						app.trigger('product:select', $.extend({id:response.insertId}, self.product()));
					});
			};
			self.scan = function(){
			
			};
			self.product = ko.observable();
			self.productCategories = ko.observableArray();
		};
	
    return viewModel;
});