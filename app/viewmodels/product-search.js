define(['plugins/http', 'durandal/app', 'knockout', 'models/product'], function (http, app, ko, product) {
	'use strict';
	
	var viewModel = function() {
		var self = this,
			queryTimeout;
		self.activate = function (params) {
        	self.fid(params.fid);
        };
		self.attached = function (params) {
        	
		};
		self.cancel = function(){
			history.back();
		};
		self.select = function(product){
			app.trigger('product:select', product);
		}
		
		self.items = ko.observableArray();
		self.fid = ko.observable();
		self.query = ko.observable('');
		self.query.subscribe(function(value){
			clearTimeout(queryTimeout);
			queryTimeout = setTimeout(function(){
				if($.trim(value)!='') {
					product.search(value, 5)
						.done(function(response){
							self.items(response);	
						});
				}else{
					self.items([]);
				}
			}, 300);
		});
		self.scan = function() {
			try {
				var scanner = cordova.require("cordova/plugin/BarcodeScanner");
				scanner.scan(
				function (result) {
				  alert("We got a barcode\n" +
						"Result: " + result.text + "\n" +
						"Format: " + result.format + "\n" +
						"Cancelled: " + result.cancelled);
				}, 
				function (error) {
				  alert("Scanning failed: " + error);
				});
			}catch(e){
				alert(e.message);
			}
		};
	};
    return viewModel;
});