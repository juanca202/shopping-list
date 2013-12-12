define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		tools = require('factor/tools'),
		version = '1.0',
		initialize = function() {
			try{
				if (localStorage['listVersion']!=version) {
					system.log('installing list database');
					tools.runSql(app.storage, 'app/models/schemas/list.sql')
						.done(function(){
							localStorage['listVersion'] = version;
							system.log('list database installed');
						})
						.fail(function(){
							system.log('fail list database installation');
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
				save: function(lid, items){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						$.each(items, function(i){
							var item = this,
								params = item.id? [item.quantity, item.unit, item.checked, item.id] : [lid, item.product.id, item.quantity, item.unit, item.checked],
								query = item.id? 'UPDATE list_item SET quantity = ?, unit = ?, checked = ? WHERE id = ?' : 'INSERT INTO list_item(lid, pid, quantity, unit, checked) VALUES (?, ?, ?, ?, ?);';
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
				getAll: function(lid){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						tx.executeSql('SELECT i.id, i.quantity, i.unit, i.checked, p.id AS product_id, p.code AS product_code, p.name AS product_name, p.unit AS product_unit, p.price AS product_price, p.picture AS product_picture FROM list_item i, product p WHERE i.pid = p.id AND i.lid = ?', [lid], function(tx, r){
							var rows = r.rows,
								items = [];
							for (var i = 0; i < rows.length; i++) {
								var row = rows.item(i), product, item = {};
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
								items.push(item);
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
	
	initialize();
	
	return model;
});