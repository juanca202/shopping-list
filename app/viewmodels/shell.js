define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', moduleId: 'viewmodels/lists' },
				{ route: 'lists/add', moduleId: 'viewmodels/list-form' },
				{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
				{ route: 'lists/:lid/buying', moduleId: 'viewmodels/list-buy' },
				{ route: 'lists/:lid/items/add', moduleId: 'viewmodels/item-form' },
				{ route: 'lists/:lid/items/:iid', moduleId: 'viewmodels/item-form' },
				{ route: 'products/add', moduleId: 'viewmodels/product-form' },
				{ route: 'products/:pid', moduleId: 'viewmodels/product-form' }
            ]);
            
            return router.activate();
        }
    };
});