define(function (require) {
	'use strict';
	
	return {
		prompt: function(message, defaultText) {
			var deferred = $.Deferred();
			if (typeof Cordova !== "undefined") {
				navigator.notification.prompt(message, function(r){
					deferred.resolve(r.input1);
				}, null, null, defaultText)
			}else{
				deferred.resolve(prompt(message, defaultText));
			}
			return deferred.promise();
		},
		confirm: function(message, title) {
			var deferred = $.Deferred();
			if (typeof Cordova !== "undefined") {
				navigator.notification.confirm(message, function(r){
					deferred.resolve(true);
				}, title);
			}else{
				deferred.resolve(confirm(message));
			}
			return deferred.promise();
		}
	};
});