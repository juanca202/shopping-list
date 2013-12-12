define(function (require) {
	'use strict';
	
	var router = require('plugins/router'),
		app = require('durandal/app'),
		fastclick = require('fastclick');	 
	 
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', moduleId: 'viewmodels/lists' },
				{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
				{ route: 'lists/:lid/purchase', moduleId: 'viewmodels/list-purchase' },
				{ route: 'lists/:lid/items/create', moduleId: 'viewmodels/item-form' },
				{ route: 'lists/:lid/items/:iid', moduleId: 'viewmodels/item-form' },
				{ route: 'products/search', moduleId: 'viewmodels/product-search' },
				{ route: 'products/:pid', moduleId: 'viewmodels/product-form' }
			]);
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