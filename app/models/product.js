define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		tools = require('factor/tools'),
		version = '1.0',
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
						deferred.resolve({success:true, id:r.insertId});
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
						deferred.resolve({success:true, product:r.rows.item(0)});
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
							products = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							products.push(row);
						}
						deferred.resolve({success:true, products:products});
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
							categories = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							categories.push(row);
						}
						deferred.resolve({success:true, categories:categories});
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
					tx.executeSql('SELECT * FROM product WHERE name LIKE ? OR name LIKE ? LIMIT ?', [query+'%', '% '+query+'%', limit], function(tx, r){
						var rows = r.rows,
							products = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							products.push(row);
						}
						deferred.resolve({success:true, products:products});
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