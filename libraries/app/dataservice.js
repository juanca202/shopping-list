define(['jquery', 'durandal/system', 'durandal/app'],  function ($, system, app) {
	var data = {};
	data.db = {};
	
	data.open = function() {
		var dbSize = 5 * 1024 * 1024; // 5MB
		data.db = openDatabase("sl", "1.0", "Shopping List", dbSize);
	}
	data.install = function() {
		data.db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS list (id INTEGER PRIMARY KEY ASC, name INTEGER NOT NULL);', [], function(tx, r){
				system.log(r);
			},data.onError);
		});
	}
	data.onError = function(tx, e) {
		system.log(e);
		//app.showMessage(e.message, 'Error');
	}
	data.list = {};
	data.list.add = function(list){
		var deferred = $.Deferred();
		data.db.transaction(function(tx) {
			tx.executeSql('INSERT INTO list(name) VALUES (?);', [list.id], function(tx, r){
				deferred.resolve(r);
			}, function(tx, e) {
				system.log(e);
				deferred.reject("Transaction Error: " + e.message);
			});
		});
		return deferred.promise();
	}
	data.open();
	
	return data;
});