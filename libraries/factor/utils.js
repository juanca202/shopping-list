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
						var sentences = result.split(";"),
							queriesExecuted = 0,
							queriesToRun = 0;
						db.transaction(function (tx) {
							$.each(sentences, function(i){ 
								var query = $.trim(this);
								if (query!=='' && query.indexOf('--')!=0) {
									queriesToRun++;
									tx.executeSql(query, [], function(tx, results){
										queriesExecuted++;
									}, function(tx, error){
										system.log(error);
										system.log(String(query));
									});
								}
							});
						}, function (error) {
							system.log(error);
							system.log(String(query));
							deferred.reject(error);
						}, function (){
							if (queriesExecuted==queriesToRun) {
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
		},
		parseRecord: function(row) {
			var item = {};
			$.each(row, function(key, value){
				var k = key.split('_');
				if (k.length>1) {
					if (!item[k[0]]) {
						item[k[0]] = {};
					}
					item[k[0]][k[1]] = value;
				}else{
					item[key] = value;
				}
				if (key=='checked') {
					item[key] = value=='true';
				}
			});
			return item;
		}
	};
});