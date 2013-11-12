define(['jquery', 'durandal/system', 'durandal/app', 'models/list', 'models/tools'], function ($, system, app, list, tools) {
	'use strict';
	
	var version = '1.0',
		initialize = function() {
			//alert(localStorage.getItem('listInstalled'));
			try{
				if (localStorage.getItem('listVersion')!=version) {
					system.log('installing list database');
					tools.runSql(app.storage, 'app/models/schemas/list.sql')
						.done(function(){
							localStorage.setItem('listVersion', version);
							system.log('list database installed');
						})
						.fail(function(){
							//TODO;
						});
				}
			}catch(e){
				alert(e.message);
			}
		},
		model = {
			save: function(list){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					var params = list.id? [list.id, list.name] : [list.name],
						query = list.id? 'UPDATE list SET name = ? WHERE id = ?' : 'INSERT INTO list(name) VALUES (?)';
					tx.executeSql(query, params, function(tx, r){
						deferred.resolve({success:true, id:r.insertId});
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
			items: {
				create: function(lid, items){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						$.each(items, function(i){
							tx.executeSql('INSERT INTO list_item(lid, pid, quantity) VALUES (?, ?, ?);', [lid, this.pid, this.quantity], function(tx, r){
								if (items.length==i+1) deferred.resolve(r);
							}, function(tx, e) {
								system.log(e);
								deferred.reject("Transaction Error: " + e.message);
							});
						});
					});
					return deferred.promise();
				},
				update: function(lid, items){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						$.each(items, function(i){
							tx.executeSql('UPDATE list_item SET quantity = ? WHERE id = ?', [this.quantity, lid], function(tx, r){
								if (items.length==i+1) deferred.resolve(r);
							}, function(tx, e) {
								system.log(e);
								deferred.reject("Transaction Error: " + e.message);
							});
						});
					});
					return deferred.promise();
				},
				getAll: function(lid){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						tx.executeSql('SELECT * FROM list_item i, product p WHERE i.pid = p.id AND i.lid = ?', [lid], function(tx, r){
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
				}
			}
		};
	
	initialize();
	
	return model;
});