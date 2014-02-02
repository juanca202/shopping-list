define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		ko = require('knockout'),
		purchase = require('models/purchase'),
		message = require('factor/message'),
		moment = require('moment'),
		ViewModel = function(){
			var self = this,
				//Private vars
				_id;
				
			ko.mapping = require('knockout.mapping');	
			
			//Public vars
			self.activate = function (id, params) {
				$.when(purchase.get(id), purchase.items.getAll({puid:id}))
					.done(function(purchaseResponse, itemsResponse){
						if (purchaseResponse.success && itemsResponse.success) {
							ko.mapping.fromJS(purchaseResponse.purchase, self.purchase);
							ko.mapping.fromJS(itemsResponse.items, {}, self.items);
						}
					});
			};
			self.items = ko.observableArray();
			self.purchase = ko.mapping.fromJS({name:''});
			self.remove = function() {
				message.confirm(_('Are you sure you want to remove this purchase?'))
					.done(function(success){
						if (success) {
							$.when(purchase.items.clear(self.purchase.id()), purchase.remove(self.purchase.id()))
								.done(function(itemsResponse, purchaseResponse){
									if (itemsResponse.success) {
										self.items.removeAll();
									}
									if (purchaseResponse.success) {
										location.href = '#/purchases';
									}
								});
						}
					});
			};
			self.share = function() {
				message.prompt('Enter an email recipient').done(function(email){
					if (email) {
						var subject = _('Shopping list shared'),
							message = [];
						$.each(self.items(), function(){
							message.push(this.quantity()>0? 
								'{0} {1} {2} {3}'.format(this.quantity(), this.unit() && this.unit()!='undefined'? this.unit() : '', this.product.name(), (this.price()>0? '@ $'+Number((this.quantity()? this.quantity() : 1)*this.price()).format(2) : '')) : this.product.name()
							);
						});
						location.href = 'mailto:{0}?subject={1}&body={2}'.format(email, subject, message.join('%0D%0A'));
					}
				});
			};
			self.totalPrice = ko.computed(function(){
				var total = 0;
				$.each(self.items(), function(){
					if (this.price()>0) {
						total += (this.quantity() || 1)*this.price();
					}
				});
				return total;
			});
		},
		viewModel = new ViewModel();
	
    return viewModel;
});