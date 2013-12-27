requirejs.config({
    paths: {
        'text': '../libraries/require/text',
        'durandal':'../libraries/durandal/js',
        'plugins' : '../libraries/durandal/js/plugins',
        'transitions' : '../libraries/durandal/js/transitions',
        'knockout': '../libraries/knockout/knockout-3.0.0',
		'knockout.mapping': '../libraries/knockout/knockout.mapping-latest',
		'knockouch': '../libraries/knockout/knockouch',
        'bootstrap': '../libraries/bootstrap/js/bootstrap',
        'jquery': '../libraries/jquery/jquery-2.0.3',
		'mobile': '../libraries/jquery/jquery.mobile.custom.min',
		'twitter/typeahead': '../libraries/twitter/typeahead.min',
		'fastclick': '../libraries/ftlabs/fastclick',
		'factor': '../libraries/factor'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery'],
            exports: 'jQuery'
		},
		'knockouch': {
			deps: ['../libraries/hammer/hammer.min']
		},
		'factor/extend': {
			deps: ['jquery']
		}
    }
});

define(function (require) {
	'use strict';
	
	var $ = require('jquery'),
		system = require('durandal/system'),
		app = require('durandal/app'),
		viewLocator = require('durandal/viewLocator'),
		mobile = require('mobile'),
		bootstrap = require('bootstrap'),
		ko = require('knockout');
		
	require('knockouch');
	require('factor/extend');
	
	//>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");

    app.title = 'Shopping List';

    app.configurePlugins({
        router:true,
        dialog: true,
        widget: true
    });

    app.start().then(function() {
        //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
        //Look for partial views in a 'views' folder in the root.
        viewLocator.useConvention();

        //Show the app by setting the root view model for our application with a transition.
        app.setRoot('viewmodels/shell', 'entrance');
		//app.adapteToDevice();
    });
	
	app.storage = openDatabase("sl", "1.0", "Shopping List", 5 * 1024 * 1024); // 5MB
});