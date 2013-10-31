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
			getItems: function(id){
				var deferred = $.Deferred();
				deferred.resolve([
					{id:1, name:'Shampoo', quantity:1, unit:'Bottle', picture:'images/shampoo.jpg'},
					{id:2, name:'Dutch cheese', quantity:250, unit:'Grs.', picture:'images/dutch-cheese.jpg'},
					{id:3, name:'Shampoo', quantity:1, unit:'Bottle', picture:'images/shampoo.jpg'}/*,
					{id:4, name:'Dutch cheese', quantity:250, unit:'Grs.', picture:'images/dutch-cheese.jpg'},
					{id:5, name:'Shampoo', quantity:1, unit:'Bottle', picture:'images/shampoo.jpg'},
					{id:6, name:'Dutch cheese', quantity:250, unit:'Grs.', picture:'images/dutch-cheese.jpg'},
					{id:7, name:'Shampoo', quantity:1, unit:'Bottle', picture:'images/shampoo.jpg'},
					{id:8, name:'Dutch cheese', quantity:250, unit:'Grs.', picture:'images/dutch-cheese.jpg'},
					{id:9, name:'Shampoo', quantity:1, unit:'Bottle', picture:'images/shampoo.jpg'},
					{id:10, name:'Dutch cheese', quantity:250, unit:'Grs.', picture:'images/dutch-cheese.jpg'}
				*/]);
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
			}
		};
	
	initialize();
	
	return model;
});