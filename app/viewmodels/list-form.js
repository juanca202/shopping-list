define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		product = require('models/product'),
		dialog = require('plugins/dialog'),
		mobile = require('mobile'),
		_id,
		ViewModel = function(){
			var self = this,
				//Private vars
				queryTimeout;
				
			ko.mapping = require('knockout.mapping');	
			
			//Public vars
			self.activate = function (id, params) {
				_id = id;
				self.mode(id == 'create'? 'create' : 'update');
				self.currentItem({id:ko.observable(-1)}); //Limpia el item actual si hay alguno seleccionado
				self.products([]);
				self.query('');
				if (self.mode() == 'create') {
					self.reset();
				}else{
					$.when(list.get(id), list.items.getAll(id))
						.done(function(listResponse, itemsResponse){
							if (listResponse.success && itemsResponse.success) {
								self.list(listResponse.list);
								ko.mapping.fromJS(itemsResponse.items, {}, self.items);
							}
						});
				}
			};
			self.addItem = function(product) {
				self.items.push(ko.mapping.fromJS({
					id:null, 
					quantity:self.queryParts().quantity, 
					unit:product.unit, 
					product:product, 
					price:null, 
					checked:false
				}));
				self.saveItems();
				self.refreshItems();
				self.currentItem({id:ko.observable(-1)});
				self.products([]);
				self.query('');
			};
			self.createProduct = function(name){
				var productData = {name:name};
				product.save(productData).done(function(response){
					if (response.success) {
						product.get(response.id).done(function(response){
							self.addItem(response.product);
						});
					}
				});	
			};
			self.currentItem = ko.observable({id:ko.observable(-1)});
			self.items = ko.observableArray();
			self.list = ko.observable();
			self.mode = ko.observable('create');
			self.products = ko.observableArray();
			self.query = ko.observable('');
			self.queryParts = ko.observable();
			self.query.subscribe(function(value){
				clearTimeout(queryTimeout);
				var query,
					keywords = $.trim(value).split(' ');
				//Si el primer valor es un numero entonces corresponde a la cantidad y solo se busca de la segunda palabra en adelante
				if (keywords.length>1 && Number(keywords[0])>0) {
					query = keywords.splice(1).join(' ');
					self.queryParts({quantity:Number(keywords[0]), name:query});
				}else{
					query = value;
					self.queryParts({quantity:null, name:query});
				}
				queryTimeout = setTimeout(function(){
					if($.trim(value)!=='') {
						product.search(query, 5)
							.done(function(response){
								if (response.success) {
									self.products(response.products);	
								}
							});
					}else{
						self.products([]);
					}
				}, 300);
			});
			self.refreshItems = function() {
				list.items.getAll(_id)
					.done(function(response){
						if (response.success) {
							ko.mapping.fromJS(response.items, self.items);
						}
					});
			};
			self.removeItem = function(item) {
				list.items.remove(item.id()).done(function(response){
					if (response.success) {
						self.items.remove(item);
					}
				});
			};
			self.reset = function() {
				self.list(null);
				self.items([]);
			};
			self.saveItems = function() {			
				list.items.save(self.list().id, ko.mapping.toJS(self.items()))
					.done(function(response){
						if (response.success) {
							ko.mapping.fromJS(response.items, self.items);
						}
					});
			};
			self.scan = function() {
				try {
					var scanner = cordova.require("cordova/plugin/BarcodeScanner");
					scanner.scan(function (result) {
						alert(result.text+' '+result.format);
						product.search(result.text, 5)
							.done(function(response){
								if (response.success) {
									if (response.products.length==1) {
										var exists = false,
											product = response.products[0]; 
										$.each(self.items(), function(){
											if (this.product.id()==product.id) {
												exists = true;
												return;
											}	
										});
										if (!exists) {
											self.addItem(product);
										}
									}else{
										self.products(response.products);
									}
								}
							});	
					}, function (error) {
						//alert("Scanning failed: " + error);
					});
				}catch(e){
					system.log(e.message);
				}
			};
			self.selectProduct = function(product) {
				var exists = false; 
				$.each(self.items(), function(){
					if (this.product.id()==product.id) {
						exists = true;
						return;
					}	
				});
				if (!exists) {
					self.addItem(product);
				}
			};
			self.setCurrentItem = function(item) {
				if (self.currentItem().id()!=item.id()) {
					self.currentItem(item);
				}else{
					self.currentItem({id:ko.observable(-1)});
				}
			};
			self.showItem = function(item){
				location.href = '#list_items/{0}'.format(item.id());
			};
			self.showProduct = function(item){
				location.href = '#products/{0}?lid={1}'.format(item.product.id(), self.list().id);
			};
			self.toggleItemCheck = function(item){
				if (self.currentItem().id()==item.id()) {
					self.currentItem({id:ko.observable(-1)});
				}
				item.checked(!item.checked());
				self.saveItems();
			};
			self.totalPrice = ko.computed(function(){
				var remaining = 0, 
					checked = 0;
				$.each(self.items(), function(){
					if (this.price()>0) {
						var total = this.quantity()*this.price();
						if (this.checked()) {
							checked += total;
						}else{
							remaining += total;
						}
					}
				});
				return {
					checked:checked,
					remaining:remaining
				};
			});
			self.addTransition = function(elem) { 
				if (elem.nodeType === 1) $(elem).hide().slideDown('fast') ;
			};
			self.removeTransition = function(elem) { 
				if (elem.nodeType === 1) $(elem).slideUp('fast', function() { $(elem).remove(); });
			};
		},
		viewModel = new ViewModel();
	
    return viewModel;
});