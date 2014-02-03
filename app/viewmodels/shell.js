define(function (require) {
	'use strict';
	
	var router = require('plugins/router'),
		app = require('durandal/app'),
		fastclick = require('fastclick'),
		ko = require('knockout');	 
	 
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Shopping Cart', css:'glyphicon glyphicon-shopping-cart', count:ko.observable(), nav:true, moduleId: 'viewmodels/list-form' },
				{ route: 'lists', title:'Lists', css:'glyphicon glyphicon-list-alt', count:ko.observable(), nav:true, moduleId: 'viewmodels/lists' },
				{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
				{ route: 'purchases', title:'History', css:'glyphicon glyphicon-time', count:ko.observable(), nav:true, moduleId: 'viewmodels/purchases' },
				{ route: 'purchases/:puid', moduleId: 'viewmodels/purchase' },
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
        }
    };
});