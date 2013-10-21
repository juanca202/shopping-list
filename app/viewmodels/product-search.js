define(['plugins/http', 'durandal/app', 'knockout', 'twitter/typeahead'], function (http, app, ko) {
	'use strict';
	
	var viewModel = function() {
		var self = this;
		self.activate = function () {
        	
        };
		self.attached = function () {
        	$('input.typeahead-products').typeahead({
			  name: 'accounts',
			  local: ['timtrueman', 'JakeHarding', 'vskarich']
			});
		};
		self.cancel = function(){
			history.back();
		};
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
	}

    return viewModel;
});