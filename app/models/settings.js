define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		utils = require('factor/utils'),
		version = '1.0',
		initialize = function() {
			
		},
		model = {
			getOptions: function(key){
				var deferred = $.Deferred();
				switch (key){
					case 'units':
						deferred.resolve({success:true, values:['kg.', 'gr.', 'lb.', 'oz.', 'piece', 'bag', 'bottle', 'box', 'case', 'pack', 'jar', 'can', 'cup', 'gallon']});
						break;
				}
				return deferred.promise();
			},
			current: {
				currency:'USD',
				language:'English'
			}
		};
	
	initialize();
	
	return model;
});