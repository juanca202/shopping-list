define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		utils = require('factor/utils'),
		model = {
			version: '1.0',
			initialize: function() {
				try{
					var deferred = $.Deferred();
					if (localStorage['product.version']!=model.version) {
						system.log('installing product database');
						utils.runSql(app.storage, 'app/models/schemas/product.sql')
							.done(function(){
								localStorage['product.version'] = model.version;
								system.log('product database installed');
								deferred.resolve({success:true});
							})
							.fail(function(err){
								var message = 'fail list database installation';
								system.log(err);
								deferred.reject({success:false, message:err});
							});
					}else{
						deferred.resolve({success:true});
					}
					return deferred.promise();
				}catch(e){
					system.log(e.message);
				}
			},
			save: function(product){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					var params = product.id? [product.name, product.cid, product.code, product.picture, product.id] : [product.name, product.cid, product.code, product.picture],
						query = product.id? 'UPDATE product SET name = ?, cid = ?, code = ?, picture = ? WHERE id = ?' : 'INSERT INTO product(name, cid, code, picture) VALUES (?, ?, ?, ?)';
					tx.executeSql(query, params, function(tx, r){
						var id = product.id? product.id : r.insertId;
						deferred.resolve({success:r.rowsAffected==1, id:id});
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
					tx.executeSql('SELECT p.id, p.cid, p.code, p.name, p.picture, c.color AS category_color FROM product p LEFT JOIN product_category c ON p.cid = c.id WHERE p.id = ?', [id], function(tx, r){
						deferred.resolve({success:true, product:utils.parseRecord(r.rows.item(0))});
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
					tx.executeSql('SELECT p.id, p.cid, p.code, p.name, p.picture, c.color AS category_color FROM product p LEFT JOIN product_category c ON p.cid = c.id', [], function(tx, r){
						var rows = r.rows,
							products = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							products.push(utils.parseRecord(row));
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
					tx.executeSql('SELECT p.id, p.cid, p.code, p.name, p.picture, c.color AS category_color FROM product p LEFT JOIN product_category c ON p.cid = c.id WHERE p.name LIKE ? OR p.name LIKE ? OR p.code = ? LIMIT ?', [query+'%', '% '+query+'%', query, limit], function(tx, r){
						var rows = r.rows,
							products = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							products.push(utils.parseRecord(row));
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
	
	return model;
});