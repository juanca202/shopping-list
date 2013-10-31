define(['jquery', 'durandal/system', 'durandal/app', 'models/list', 'models/tools'], function ($, system, app, list, tools) {
	'use strict';
	
	var version = '1.0',
		initialize = function() {
			try{
				if (localStorage.getItem('productVersion')!=version) {
					system.log('installing product database');
					tools.runSql(app.storage, 'app/models/schemas/product.sql')
						.done(function(){
							localStorage.setItem('productVersion', version);
							system.log('product database installed');
						})
						.fail(function(err){
							system.log(err);
						});
				}
			}catch(e){
				alert(e.message);
			}
		},
		model = {
			create: function(product){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('INSERT INTO product(name, cid, unit, price, code, picture) VALUES (?, ?, ?, ?, ?, ?);', [product.name, product.cid, product.unit, product.price, product.code, product.picture], function(tx, r){
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
					tx.executeSql('SELECT * FROM product WHERE id = ?', [id], function(tx, r){
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
					tx.executeSql('SELECT * FROM product', [], function(tx, r){
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
			getCategories: function(){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('SELECT * FROM product_category', [], function(tx, r){
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
					tx.executeSql('DELETE FROM product WHERE id = ?', [id], function(tx, r){
						deferred.resolve(r.rows.item(0));
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			search: function(query, limit){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('SELECT * FROM product WHERE name LIKE ? LIMIT ?', [query+'%', limit], function(tx, r){
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
				/*
				deferred.resolve([
					{id:1, code:324352435, name:'Shampoo', unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{id:2, code:324352435, name:'Dutch cheese', unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{id:3, code:324352435, name:'Shampoo', unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{id:4, code:324352435, name:'Dutch cheese', unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{id:5, code:324352435, name:'Shampoo', unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{id:6, code:324352435, name:'Dutch cheese', unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{id:7, code:324352435, name:'Shampoo', unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{id:8, code:324352435, name:'Dutch cheese', unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{id:9, code:324352435, name:'Shampoo', unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{id:10, code:324352435, name:'Dutch cheese', unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'}
				]);*/
				return deferred.promise();
			}
		};
	
	initialize();
	
	return model;
});