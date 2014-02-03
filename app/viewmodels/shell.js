define(function (require) {
	'use strict';
	
	var router = require('plugins/router'),
		app = require('durandal/app'),
		fastclick = require('fastclick');	 
	 
    return {
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Shopping Cart', css:'glyphicon glyphicon-shopping-cart', nav:true, moduleId: 'viewmodels/list-form' },
				{ route: 'lists', title:'Lists', css:'glyphicon glyphicon-list-alt', nav:true, moduleId: 'viewmodels/lists' },
				{ route: 'lists/:lid', moduleId: 'viewmodels/list-form' },
				{ route: 'purchases', title:'History', css:'glyphicon glyphicon-time', nav:true, moduleId: 'viewmodels/purchases' },
				{ route: 'purchases/:puid', moduleId: 'viewmodels/purchase' },
				{ route: 'list_items/:iid', moduleId: 'viewmodels/item-form' },
				{ route: 'products/:pid', moduleId: 'viewmodels/product-form' },
				{ route: 'help', title:'Help', css:'glyphicon glyphicon-question-sign', nav:true, moduleId: 'viewmodels/help' }
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