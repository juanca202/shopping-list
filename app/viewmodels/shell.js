define(function (require) {
	'use strict';
	
	var router = require('plugins/router'),
		app = require('durandal/app'),
		fastclick = require('fastclick'),
		ko = require('knockout'),
		list = require('models/list'),
		$ = require('jquery'),
		ViewModel = function() {
			var self = this;
			
			self.activate = function () {
				router.map([
					{ route: '', title:'Shopping cart', css:'glyphicon glyphicon-shopping-cart', count:ko.observable(), nav:true, moduleId: 'viewmodels/cart' },
					{ route: 'lists', title:'Lists', css:'glyphicon glyphicon-list-alt', count:ko.observable(), nav:true, moduleId: 'viewmodels/lists' },
					{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
					{ route: 'purchases', title:'Purchase history', css:'glyphicon glyphicon-time', count:ko.observable(), nav:true, moduleId: 'viewmodels/purchases' },
					{ route: 'purchases/:puid', title:'Purchase', moduleId: 'viewmodels/purchase' },
					{ route: 'list-items/:iid', moduleId: 'viewmodels/item-form' },
					{ route: 'products/:pid', moduleId: 'viewmodels/product-form' },
					{ route: 'settings', title:'Settings', css:'glyphicon glyphicon-cog', count:ko.observable(), nav:true, moduleId: 'viewmodels/settings' }
				]).buildNavigationModel();
				//Update anaytics whenever the router navigates
				router.on('router:navigation:complete', function(instance, instruction) {
					if (typeof gaPlugin!='undefined') gaPlugin.trackPage(function(){}, function(){}, instruction.fragment);
				});
				//Elimina los 300ms al hacer click en un boton
				fastclick.attach(document.body);
				
				return router.activate();
			};
			self.attached = function(){
				/*
				$(document)
					.on('focusin', ':input', function(e){
						$('body').removeClass('focusout').addClass('focusin');
					})
					.on('focusout', ':input', function(e){
						$('body').removeClass('focusin').addClass('focusout');
					});
				*/
			};
			self.refreshCartCount = function(){
				var count = 0;
				list.items.getAll({lid:1})
					.done(function(response){
						$.each(response.items, function(){
							if (!this.checked) {
								count++;
							}
						});
						self.router.navigationModel()[0].count(count);
					});
			};
			self.navGlobal = ko.observable(false);
			self.router = router;
		},
		viewModel = new ViewModel();		
	 
    return viewModel;
});