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
		}
	};
});