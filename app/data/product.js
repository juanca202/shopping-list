define(['jquery', 'durandal/system', 'durandal/app', 'data/list', 'data/tools'], function ($, system, app, list, tools) {
	var version = '1.0',
		initialize = function() {
			try{
				if (localStorage.getItem('productInstalled')!=version) {
					system.log('installing product database');
					tools.runSql(app.storage, 'app/data/scripts/product_install.sql')
						.done(function(){
							localStorage.setItem('productInstalled', version);
							system.log('product database installed');
						})
						.fail(function(){
							//TODO;
						});
				}
			}catch(e){
				alert(e.message);
			}
		},
		viewModel = {
			create: function(list){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('INSERT INTO list(name) VALUES (?);', [list.name], function(tx, r){
						deferred.resolve(r);
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			get: function(id){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('SELECT * FROM list WHERE id = ?', [id], function(tx, r){
						deferred.resolve(r.rows.item(0));
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			getAll: function(){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('SELECT * FROM list', [], function(tx, r){
						var rows = r.rows,
							items = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							items.push(row);
						}
						deferred.resolve(items);
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			remove: function(id){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('DELETE FROM list WHERE id = ?', [id], function(tx, r){
						deferred.resolve(r.rows.item(0));
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			
		};
	
	initialize();
	
	return viewModel;
});