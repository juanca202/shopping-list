define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app');
	
	return {
		runSql:function(db, url) {
			try {
				var deferred = $.Deferred();
				$.get(url)
					.done(function(result){
						var scripts = result.split(";"),
							scriptsExecuted = 0;
						db.transaction(function (tx) {
							$.each(scripts, function(i){ 
								var query = $.trim(this);
								if (query!=='') {
									tx.executeSql(query, [], function(tx, results){
										scriptsExecuted++;
									}, function(tx, error){
										system.log(error);
										system.log(String(query));
									});
								}else{
									scripts.splice(i, 1);
								}
							});
						}, function (error) {
							deferred.reject(error);
						}, function (){
							if (scriptsExecuted==scripts.length) {
								deferred.resolve();
							}
						});
					})
					.fail(function(event, jqXHR, ajaxSettings, thrownError) {
						deferred.reject(thrownError);
					});
				return deferred.promise();
			}catch(err){
				system.log(err.message);
				system.log(err.stack);
			}
		}
	};
});