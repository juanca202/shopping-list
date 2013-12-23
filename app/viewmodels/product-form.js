define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		product = require('models/product'),
		viewModel = function(){
			var self = this;
			self.activate = function (productData) {
				self.product(productData);
				product.getCategories().done(function(response){
					self.productCategories(response);
				});
			};
			self.attachPicture = function(){
			
			};
			self.product = ko.observable();
			self.productCategories = ko.observableArray();
			self.save = function(form){
				product.save(self.product())
					.done(function(response){
						app.trigger('product:select', $.extend({id:response.insertId}, self.product()));
					});
			};
			self.scan = function(){
			
			};
		};
	
    return viewModel;
});