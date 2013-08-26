define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', moduleId: 'viewmodels/lists' },
				{ route: 'lists/add', moduleId: 'viewmodels/list-form' },
				{ route: 'items/add', moduleId: 'viewmodels/item-form' }
            ]);
            
            return router.activate();
        }
    };
});