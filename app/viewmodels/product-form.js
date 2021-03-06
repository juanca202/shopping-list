define(function (require) {
	'use strict';
	
	var app = require('durandal/app'),
		ko = require('knockout'),
		system = require('durandal/system'),
		product = require('models/product'),
		list = require('models/list'),
		shell = require('viewmodels/shell'),
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
				lid = Number(params.lid);
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
						$.each(response.categories, function(){
							this.nameTranslated = _(this.name);
						});
						self.productCategories(response.categories);
					}
				});
				shell.navGlobal(false);
			};
			self.attachPicture = function(){
				navigator.camera.getPicture(function(imageURI) {
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
				if (lid!=1) {
					location.href = '#lists/{0}'.format(lid);
				}else{
					location.href = '#';
				}
			};
			self.product = ko.mapping.fromJS({name:'', code:'', category:{id:''}, picture:'undefined'});
			self.productCategories = ko.observableArray();
			self.save = function(form){
				product.save(ko.mapping.toJS(self.product))
					.done(function(response){
						if (response.success) {
							if (mode=='create') {
								var productItem = ko.mapping.toJS(self.product);
								list.items.save(lid, [{
									id:null, 
									quantity:1, 
									unit:null, 
									product:$.extend(productItem, {id:response.id}), 
									price:null, 
									checked:false
								}]).done(function(response){
									if (response.success) {
										self.back();
									}
								});
							}else{
								self.back();
							}
						}
					});
			};
			self.scan = function() {
				try {
					var scanner = cordova.require("cordova/plugin/BarcodeScanner");
					scanner.scan(function (result) {
						//alert(result.text+' '+result.format);
						if ($.trim(result.text)!='') {
							self.product.code(result.text);
						}
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