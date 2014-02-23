define(function (require) {
	'use strict';
	
	return {
		prompt: function(message, defaultText, title) {
			var deferred = $.Deferred();
			if (typeof Cordova !== "undefined") {
				navigator.notification.prompt(message, function(r){
					if (r.buttonIndex==1) {
						deferred.resolve(r.input1);
					}else{
						deferred.reject();
					}
				}, title, [_('Ok'),_('Cancel')], defaultText)
			}else{
				deferred.resolve(prompt(message, defaultText));
			}
			return deferred.promise();
		},
		confirm: function(message, title) {
			var deferred = $.Deferred();
			if (typeof Cordova !== "undefined") {
				navigator.notification.confirm(message, function(index){
					if (index==1) {
						deferred.resolve(true);
					}else{
						deferred.reject();
					}
				}, title, [_('Ok'),_('Cancel')]);
			}else{
				deferred.resolve(confirm(message));
			}
			return deferred.promise();
		}
	};
});