define(function (require) {
	'use strict';
	
	var router = require('plugins/router'),
		app = require('durandal/app'),
		fastclick = require('fastclick');	 
	 
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', moduleId: 'viewmodels/home' },
				{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
				{ route: 'purchases/:puid', moduleId: 'viewmodels/list-purchase' },
				{ route: 'list_items/:iid', moduleId: 'viewmodels/item-form' },
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