define(['jquery', 'durandal/system', 'durandal/app'],  function ($, system, app) {
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
										console.log(error);
										console.log(String(query));
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
				console.log(err.message);
				console.log(err.stack);
			}
		}
	};
});