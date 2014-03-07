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
				$.ajax({
					url:'app/models/options/{0}.json'.format(key),
					dataType:'json'
				})
					.done(function(response){
						deferred.resolve({success:true, data:response});
					})
					.fail(function(request, message, exception){
						deferred.reject({success:false, message:message});
					});
				return deferred.promise();
			},
			getVariable: function(key){
				return JSON.parse(localStorage['settings.{0}'.format(key)] || 'false');
			},
			setVariable: function(key, value){
				localStorage['settings.{0}'.format(key)] = JSON.stringify(value);
			}
		};
	
	initialize();
	
	return model;
});