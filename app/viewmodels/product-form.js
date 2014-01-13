define(function (require) {
	'use strict';
	
	var app = require('durandal/app'),
		ko = require('knockout'),
		system = require('durandal/system'),
		product = require('models/product'),
		viewModel = function(){
			var self = this,
				//Private vars
				_id,	
				mode,	
				lid;
				
			ko.mapping = require('knockout.mapping');	
				
			self.activate = function (id, params) {
				_id = id;
				mode = id == 'create'? 'create' : 'update';
				lid = params.lid;
				if (mode=='update') {
					product.get(id).done(function(response){
						if (response.success) {
							ko.mapping.fromJS(response.product, self.product);
						}
					});
				}else{
					ko.mapping.fromJS($.extend({name:'', code:'', category:{id:''}, picture:'undefined'}, params), self.product);
				}
				product.getCategories().done(function(response){
					if (response.success) {
						self.productCategories(response.categories);
					}
				});
			};
			self.attachPicture = function(){
				navigator.camera.getPicture(function(imageURI) {
					alert(imageURI);
					self.product.picture(imageURI);
				}, function(message) {
					//alert('Failed because: ' + message);
				}, { 
					quality: 50,
					targetWidth: 400,
					targetHeight: 400,
					destinationType: Camera.DestinationType.FILE_URI
				});
			};
			self.back = function(){
				location.href = '#lists/{0}'.format(lid);
			};
			self.product = ko.mapping.fromJS({name:'', code:'', category:{id:''}, picture:'undefined'});
			self.productCategories = ko.observableArray();
			self.save = function(form){
				product.save(ko.mapping.toJS(self.product))
					.done(function(response){
						if (response.success) {
							self.back();
						}
					});
			};
			self.scan = function() {
				try {
					var scanner = cordova.require("cordova/plugin/BarcodeScanner");
					scanner.scan(function (result) {
						alert(result.text+' '+result.format);
						self.product.code(result.text);		
					}, function (error) {
						//alert("Scanning failed: " + error);
					});
				}catch(e){
					alert(e.message);
				}
			};
		};
	
    return viewModel;
});