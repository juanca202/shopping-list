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
					{ route: '', title:_('Shopping cart'), css:'glyphicon glyphicon-shopping-cart', count:ko.observable(), nav:true, moduleId: 'viewmodels/cart' },
					{ route: 'lists', title:_('Lists'), css:'glyphicon glyphicon-list-alt', count:ko.observable(), nav:true, moduleId: 'viewmodels/lists' },
					{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
					{ route: 'purchases', title:_('Purchase history'), css:'glyphicon glyphicon-time', count:ko.observable(), nav:true, moduleId: 'viewmodels/purchases' },
					{ route: 'purchases/:puid', title:_('Purchase'), moduleId: 'viewmodels/purchase' },
					{ route: 'list-items/:iid', moduleId: 'viewmodels/item-form' },
					{ route: 'products/:pid', moduleId: 'viewmodels/product-form' },
					{ route: 'settings', title:_('Settings'), css:'glyphicon glyphicon-cog', count:ko.observable(), nav:true, moduleId: 'viewmodels/settings' },
					{ route: 'settings/:key/options', moduleId: 'viewmodels/settings-options' }
				]).buildNavigationModel();
				//Update anaytics whenever the router navigates
				router.on('router:navigation:complete', function(instance, instruction) {
					if (window.plugins && typeof window.plugins.gaPlugin!='undefined') {
						window.plugins.gaPlugin.trackPage(function(result){
							//alert('gaPlugin: '+result);
							//console.log('gaPlugin: '+result);
						}, function(error){
							//alert('gaPlugin: '+error);
							system.log('gaPlugin: '+error);
						}, $.trim(instruction.fragment)!=''? instruction.fragment : 'home');
					}
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