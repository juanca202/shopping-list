﻿define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', moduleId: 'viewmodels/lists' },
				{ route: 'lists/create', moduleId: 'viewmodels/list-form' },
				{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
				{ route: 'lists/:lid/purchase', moduleId: 'viewmodels/list-purchase' },
				{ route: 'lists/:lid/items/create', moduleId: 'viewmodels/item-form' },
				{ route: 'lists/:lid/product/search', moduleId: 'viewmodels/product-search' },
				{ route: 'lists/:lid/items/:iid', moduleId: 'viewmodels/item-form' },
				{ route: 'products/create', moduleId: 'viewmodels/product-form' },
				{ route: 'products/:pid', moduleId: 'viewmodels/product-form' }
            ]);
			//Update anaytics whenever the router navigates
			router.on('router:navigation:complete', function(instance, instruction) {
				if (typeof gaPlugin!='undefined') gaPlugin.trackPage(function(){}, function(){}, instruction.fragment);
			});
            
            return router.activate();
        }
    };
});