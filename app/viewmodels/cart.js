define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		list = require('models/list'),
		product = require('models/product'),
		purchase = require('models/purchase'),
		dialog = require('plugins/dialog'),
		message = require('factor/message'),
		settings = require('models/settings'),
		shell = require('viewmodels/shell'),
		ViewModel = function(){
			var self = this,
				//Private vars
				_id,
				mode,
				queryTimeout;
				
			ko.mapping = require('knockout.mapping');	
			
			//Public vars
			self.activate = function (id, params) {
				_id = id || 1;
				mode = _id == 'create'? 'create' : 'update';
				self.currency(settings.getVariable('currency'));
				self.currentItem({id:ko.observable(-1)}); //Limpia el item actual si hay alguno seleccionado
				self.products([]);
				self.query('');
				if (mode == 'create') {
					self.reset();
				}else{
					$.when(list.get(_id), list.items.getAll({lid:_id}))
						.done(function(listResponse, itemsResponse){
							if (listResponse.success && itemsResponse.success) {
								ko.mapping.fromJS(listResponse.list, self.list);
								ko.mapping.fromJS(itemsResponse.items, {}, self.items);
								shell.refreshCartCount();
							}
						});
				}
				shell.navGlobal(_id==1); 
			};
			self.addItem = function(product) {
				list.items.save(self.list.id(), [{
					id:null, 
					quantity:self.queryParts().quantity, 
					unit:null, 
					product:product, 
					price:(self.queryParts().price/(self.queryParts().quantity? self.queryParts().quantity : 1)).format(), 
					checked:false
				}]).done(function(response){
					if (response.success) {
						self.refreshItems();
						self.currentItem({id:ko.observable(-1)});
						self.products([]);
						self.query('');
                        shell.navGlobal(true);
					}
				});
			};
			self.cart = ko.observable();
			self.clearAll = function(redirect) {
				list.items.clear(self.list.id())
					.done(function(response){
						if (response.success) {
							if (typeof redirect == 'string'){
								location.href = redirect;
								if (self.list.id()==1) {
									shell.refreshCartCount();
								}
							}else if (self.list.id()!=1) {
								location.href = '#/lists';
							}else{
								self.refreshItems();
							}
						}
					});
			};
			self.clearQuery = function() {
                self.query('');
                shell.navGlobal(true);
            };
            self.checkout = function() {
				purchase.save(ko.mapping.toJS(self.list), ko.mapping.toJS(self.items()))
					.done(function(response){
						if(response.success) {
							self.clearAll('#/purchases');
							if (window.plugins && typeof window.plugins.gaPlugin!='undefined') {
								window.plugins.gaPlugin.trackEvent(function(result){
									//alert('gaPlugin: '+result);
									//console.log('gaPlugin: '+result);
								}, function(error){
									system.log('gaPlugin: '+error);
								}, 'Cart', 'checkout', settings.getVariable('currency').code, self.totalPrice().checked);
							}
						}
					});	
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
			self.list = ko.mapping.fromJS({id:null, name:''});
			self.markAll = function() {
				$.each(self.items(), function(){
					var item = this;
					item.checked(true);
				});
				self.saveItems();
			};
			self.products = ko.observableArray();
			self.query = ko.observable('');
			self.queryParts = ko.observable({quantity:null, name:'', price:null});
			self.query.subscribe(function(value){
				clearTimeout(queryTimeout);
				var query = $.trim(value),
					keywords = $.trim(value).split(' '),
                    quantity = null,
                    price = null;
                
                //Si el primer valor es un numero entonces corresponde a la cantidad y solo se busca de la segunda palabra en adelante
				if (keywords.length>1 && Number(keywords[0])>0) {
					query = $.trim(keywords.slice(1).join(' '));
					quantity = Number(keywords[0]);
				}
                
                //Si el valor es un numero no hace la busqueda
                if (!isNaN(value)) {
					query = '';
                    quantity = null;
				}
                
                //Si encuentra el simbolo de la moneda actual lo considera como un precio y no lo agrega al nombre del producto
                if (keywords.length>1 && keywords[keywords.length-1].indexOf(settings.getVariable('currency').symbol)==0) {
                    var nameKeywords = $.trim(query).split(' ');
                    nameKeywords.pop();
                    query = $.trim(nameKeywords.join(' '));
                    price = Number(keywords[keywords.length-1].substring(1));
                }
                                 
                self.queryParts({quantity:quantity, name:query, price:price});
                
				if(query!='') {
					queryTimeout = setTimeout(function(){
						product.search(query, 5)
							.done(function(response){
								if (response.success) {
                                    $.each(response.products, function(){
										this.highlight = this.name.replace(new RegExp(query, 'gi'), '<strong>' + query + '</strong>');
									});
									self.products(response.products);	
								}
							});
					}, 300);
				}else{
					self.products([]);
				}
			});
			self.refreshItems = function() {
				list.items.getAll({lid:_id})
					.done(function(response){
						if (response.success) {
							ko.mapping.fromJS(response.items, self.items);
							shell.refreshCartCount();
						}
					});
			};
			self.remove = function() {
				message.confirm(_('Are you sure you want to remove this list?'))
					.done(function(success){
						if (success) {
							$.when(list.items.clear(self.list.id()), list.remove(self.list.id()))
								.done(function(itemsResponse, listResponse){
									if (itemsResponse.success) {
										self.items.removeAll();
									}
									if (listResponse.success) {
										if (self.list.id()!=1) {
											location.href = '#/lists';
										}else{
											shell.refreshCartCount();
											location.href = '#';
										}
									}
								});
						}
					});
			};
			self.removeItem = function(item) {
				list.items.remove(item.id()).done(function(response){
					if (response.success) {
						self.items.remove(item);
						shell.refreshCartCount();
					}
				});
			};
			self.rename = function() {
				message.prompt('Enter list name', self.list.name()).done(function(name){
					if (name) {
						list.save({id:self.list.id(), name:name}).done(function(response){
							if (response.success) {
								self.list.name(name);
							}
						});
					}
				});
			};
			self.reset = function() {
				self.list(null);
				self.items([]);
			};
			self.router = require('plugins/router');
			self.saveItems = function() {			
				list.items.save(self.list.id(), ko.mapping.toJS(self.items()))
					.done(function(response){
						if (response.success) {
							self.refreshItems();
						}
					});
			};
			self.scan = function() {
				try {
					var scanner = cordova.require("cordova/plugin/BarcodeScanner");
					scanner.scan(function (result) {
						//alert(result.text+' '+result.format);
						if ($.trim(result.text)!='') {
							product.search(result.text, 5)
								.done(function(response){
									if (response.success) {
										if (response.products.length==0){
											location.href = '#products/create?lid={0}&code={1}'.format(self.list.id(), result.text);
										}else if (response.products.length==1) {
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
							}
					}, function (error) {
						//alert("Scanning failed: " + error);
					});
				}catch(e){
					system.log(e.message);
				}
			};
            self.searching = ko.observable(false);
            self.searching.subscribe(function(value) {
                if (value || self.query().length>0) {
                    shell.navGlobal(false);
                } else {
                    shell.navGlobal(true);
                }
            });
			self.setCurrentItem = function(item) {
				if (self.currentItem().id()!=item.id()) {
					self.currentItem(item);
				}else{
					self.currentItem({id:ko.observable(-1)});
				}
			};
			self.currency = ko.observable();	
			self.shareRealtime = function(){
            
            };
            self.shareToEmail = function() {
				message.prompt('Enter an email recipient').done(function(email){
					if (email) {
						var subject = _('Shopping list shared'),
							message = [];
						$.each(self.items(), function(){
							message.push(this.quantity()>0? 
								'{0} {1} {2} {3}'.format(this.quantity(), this.unit() && this.unit()!='undefined'? this.unit() : '', this.product.name(), (price()>0? '@ $'+Number((quantity()? quantity() : 1)*price()).format(2) : '')) : this.product.name()
							);
						});
						location.href = 'mailto:{0}?subject={1}&body={2}'.format(email, subject, message.join('%0D%0A'));
					}
				});
			};
			self.showItem = function(item){
				location.href = '#list-items/{0}'.format(item.id());
			};
			self.showProduct = function(item){
				location.href = '#products/{0}?lid={1}'.format(item.product.id(), self.list.id());
			};
			self.toggleItemAtCart = function(item) {
				var request = !item.cart.id()? list.items.save(1, [$.extend(ko.mapping.toJS(item), {id:null})]) : list.items.remove(item.cart.id());
				request
					.done(function(response){
						if (response.success) {
							self.refreshItems();
						}
					});
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
					checked = 0,
                    checkedCount = 0;
				$.each(self.items(), function(){
					if (this.price()>0) {
						var total = (this.quantity() || 1)*this.price();
						if (this.checked()) {
							checked += total;
						}else{
							remaining += total;
						}
					}
                    if (this.checked()) {
                        checkedCount++;
                    }
				});
				return {
                    checkedCount:checkedCount,
					checked:checked,
					remaining:remaining
				};
			});
			self.unmarkAll = function() {
				$.each(self.items(), function(){
					var item = this;
					item.checked(false);
				});
				self.saveItems();
			};
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