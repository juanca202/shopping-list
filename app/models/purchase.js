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
					if (localStorage['purchase.version']!=model.version) {
						system.log('installing purchase database');
						utils.runSql(app.storage, 'app/models/schemas/purchase.sql')
							.done(function(){
								localStorage['purchase.version'] = model.version;
								system.log('purchase database installed');
								deferred.resolve({success:true});
							})
							.fail(function(){
								var message = 'fail purchase database installation';
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
			get: function(id){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					tx.executeSql('SELECT * FROM purchase WHERE id = ?', [id], function(tx, r){
						deferred.resolve({success:true, purchase:r.rows.item(0)});
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			getAll: function(filters){
				var deferred = $.Deferred(),
					limits = filters && filters.limit? 'LIMIT {0}'.format(filters.limit) : '';
				app.storage.transaction(function(tx) {
					tx.executeSql('SELECT * FROM purchase ORDER BY timestamp DESC '+limits, [], function(tx, r){
						var rows = r.rows,
							purchases = [];
						for (var i = 0; i < rows.length; i++) {
							var row = rows.item(i);
							purchases.push(utils.parseRecord(row));
						}
						deferred.resolve({success:true, purchases:purchases});
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			save: function(list, items){
				var deferred = $.Deferred();
				app.storage.transaction(function(tx) {
					var query = 'INSERT INTO purchase(lid, vid, venue_platform, lat, lng, currency, total, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
						total = 0,
						checkedItems = [];
					
					$.each(items, function(){
						if (this.checked) {
							checkedItems.push(this);
							if (this.price>0) {
								total += (this.quantity || 1)*this.price;
							}
						}						
					});
					
					tx.executeSql(query, [list.id, '', '', '', '', 'USD', total, (new Date()).getTime()], function(tx, r){
						var puid = r.insertId;
						//deferred.resolve({success:r.rowsAffected==1, id:id});
						model.items.save(puid, checkedItems)
							.done(function(){
								deferred.resolve({success:r.rowsAffected==1, id:puid});
							})
							.fail(function(error){
								deferred.reject(error);
							});
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
					tx.executeSql('DELETE FROM purchase WHERE id = ?', [id], function(tx, r){
						deferred.resolve({success:r.rowsAffected==1});
					}, function(tx, e) {
						system.log(e);
						deferred.reject("Transaction Error: " + e.message);
					});
				});
				return deferred.promise();
			},
			items: {
				clear: function(puid){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						tx.executeSql('DELETE FROM purchase_item WHERE puid = ?', [puid], function(tx, r){
							deferred.resolve({success:r.rowsAffected>0});
						}, function(tx, e) {
							system.log(e);
							deferred.reject("Transaction Error: " + e.message);
						});
					});
					return deferred.promise();
				},
				getAll: function(filters){
					var deferred = $.Deferred();
					app.storage.transaction(function(tx) {
						tx.executeSql('SELECT i.id, i.quantity, i.unit, i.price, p.id AS product_id, p.code AS product_code, p.name AS product_name, p.picture AS product_picture, c.color AS product_category_color FROM purchase_item i, product p LEFT JOIN product_category c ON p.cid = c.id WHERE i.pid = p.id AND i.puid = ? ORDER BY p.cid', [filters.puid], function(tx, r){
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
				},
				save: function(puid, items){
					var deferred = $.Deferred();
					
					app.storage.transaction(function(tx) {						
						$.each(items, function(i){
							var item = this,
								params = [puid, item.product.id, item.product.category.id, item.quantity, item.unit, item.price],
								query = 'INSERT INTO purchase_item(puid, pid, cid, quantity, unit, price) VALUES (?, ?, ?, ?, ?, ?);';
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
				}
			}
		};
	
	return model;
});