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
					if (localStorage['list.version']!=model.version) {
						system.log('installing list database');
						utils.runSql(app.storage, 'app/models/schemas/list.sql')
							.done(function(){
								localStorage['list.version'] = model.version;
								system.log('list database installed');
								deferred.resolve({success:true});
							})
							.fail(function(){
								var message = 'fail list database installation';
								system.log(message);
								deferred.reject({success:false, message:message});
							});
					}else{
						deferred.resolve({success:true});
					}
					return deferred.promise();
				}catch(e){
					system.log(e.message);
				}
			},
			save: function(list){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					var params = list.id? [list.name, list.id] : [list.name],
						query = list.id? 'UPDATE list SET name = ? WHERE id = ?' : 'INSERT INTO list(name) VALUES (?)';
					tx.executeSql(query, params, function(tx, r){
						var id = list.id? list.id : r.insertId;
						deferred.resolve({success:r.rowsAffected==1, id:id});
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
						deferred.resolve({success:true, list:r.rows.item(0)});
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
							lists = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							lists.push(row);
						}
						deferred.resolve({success:true, lists:lists});
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			items: {
				save: function(){
					var deferred = $.Deferred(),
						_arguments = arguments;
					
					if (typeof _arguments[0]=='number') { //Multiple rows affect params: lid, items
						var items = _arguments[1];
						var lid = _arguments[0];
						app.storage.transaction(function(tx) {						
							$.each(items, function(i){
								var item = this,
									params = item.id? [item.quantity, item.unit, item.price, item.checked, item.id] : [lid, item.product.id, item.quantity, item.unit, item.price, item.checked],
									query = item.id? 'UPDATE list_item SET quantity = ?, unit = ?, price = ?, checked = ? WHERE id = ?' : 'INSERT INTO list_item(lid, pid, quantity, unit, price, checked) VALUES (?, ?, ?, ?, ?, ?);';
								tx.executeSql(query, params, function(tx, r){
									if (!item.id && r.rowsAffected==1) {
										$.extend(item, {id:r.insertId});
									}
								}, function(tx, e) {
									system.log(e);
									deferred.reject("Transaction Error: " + e.message);
								});
							});
						}, function (error) {
							system.log(error);
							deferred.reject({success:false, message:error});
						}, function (){
							deferred.resolve({success:true, items:items});
						});					
					}else if (typeof _arguments[0]=='object'){ //Single row affect params: item
						var item = _arguments[0];
						app.storage.transaction(function(tx) {	
							tx.executeSql('UPDATE list_item SET quantity = ?, unit = ?, price = ?, checked = ? WHERE id = ?', [item.quantity, item.unit, item.price, item.checked, item.id], function(tx, r){
								var id = item.id? item.id : r.insertId;
								deferred.resolve({success:r.rowsAffected==1, id:id});
							}, function(tx, e) {
								system.log(e);
								deferred.reject("Transaction Error: " + e.message);
							});
						}, function (error) {
							system.log(error);
							deferred.reject({success:false, message:error});
						});
					}
					return deferred.promise();
				},
				remove: function(id){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						tx.executeSql('DELETE FROM list_item WHERE id = ?', [id], function(tx, r){
							deferred.resolve({success:r.rowsAffected==1});
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
						tx.executeSql('SELECT i.id, i.lid, i.quantity, i.unit, i.price, i.checked, p.id AS product_id, p.code AS product_code, p.name AS product_name, p.picture AS product_picture FROM list_item i, product p WHERE i.pid = p.id AND i.id = ?', [id], function(tx, r){
							var row = r.rows.item(0);
							deferred.resolve({success:true, item:utils.parseRecord(row)});
						}, function(tx, e) {
							system.log(e);
							deferred.reject("Transaction Error: " + e.message);
						});
					});
					return deferred.promise();
				},
				getAll: function(lid){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						tx.executeSql('SELECT i.id, i.quantity, i.unit, i.price, i.checked, p.id AS product_id, p.code AS product_code, p.name AS product_name, p.picture AS product_picture, c.color AS product_category_color FROM list_item i, product p LEFT JOIN product_category c ON p.cid = c.id WHERE i.pid = p.id AND i.lid = ? ORDER BY p.cid', [lid], function(tx, r){
							var rows = r.rows,
								items = [];
							for (var i = 0; i < rows.length; i++) {
								var row = rows.item(i);
								items.push(utils.parseRecord(row));
							}
							deferred.resolve({success:true, items:items});
						}, function(tx, e) {
							system.log(e);
							deferred.reject("Transaction Error: " + e.message);
						});
					}, function(e){
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
					return deferred.promise();
				}
			}
		};
	
	return model;
});