define(['jquery', 'durandal/system', 'durandal/app', 'knockout', 'data/list'], function ($, system, app, ko, list) {
    'use strict';
	
	if (typeof cordova != 'undefined') {
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	}
	
	var List = function(data) {
			var data = data || {};
			this.id = ko.observable(data.id);
			this.name = ko.observable(data.name);
		},
		viewModel = function(){
			var self = this;
			self.activate = function (id) {
				if (id) {
					$.when(list.get(id), list.getItems(id))
						.done(function(list, items){
							self.list = new List(list);
							self.items(items);
						});
				}
			};
			self.save = function(){
				list.create(ko.toJS(self.list))
					.done(function(){
						location.href = '#';
					});
			};
			self.scan = function() {
				scanner.scan(
				function (result) {
				  alert("We got a barcode\n" +
						"Result: " + result.text + "\n" +
						"Format: " + result.format + "\n" +
						"Cancelled: " + result.cancelled);
				}, 
				function (error) {
				  alert("Scanning failed: " + error);
				}
			);
			},
			self.list = new List(),
			self.items = ko.observableArray();
		}
	
    return viewModel;
});