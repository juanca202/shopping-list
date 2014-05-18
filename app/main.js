requirejs.config({
    paths: {
        'text': '../libraries/require/text',
        'durandal':'../libraries/durandal/js',
        'plugins' : '../libraries/durandal/js/plugins',
        'transitions' : '../libraries/durandal/js/transitions',
        'knockout': '../libraries/knockout/knockout-3.1.0',
		'knockout.mapping': '../libraries/knockout/knockout.mapping-latest',
		'knockouch': '../libraries/knockout/knockouch',
        'bootstrap': '../libraries/bootstrap/js/bootstrap',
        'jquery': '../libraries/jquery/jquery-2.1.0',
		'moment': '../libraries/moment/moment.min',
		'fastclick': '../libraries/ftlabs/fastclick',
		'factor': '../libraries/factor',
		'translate': '../libraries/localeplanet/translate'
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
		bootstrap = require('bootstrap'),
		ko = require('knockout'),
		list = require('models/list'),
		product = require('models/product'),
		purchase = require('models/purchase'),
		settings = require('models/settings');
		
	require('knockouch');
	require('factor/extend');
	require('translate');
	
	//Storage
	app.storage = openDatabase("sl", "1.0", "Shopping List", 5 * 1024 * 1024); // 5MB
	
	//Settings
	var language = {"name":"English", "code":"en"};
	if (navigator.language.split('-')[0]=='es') {
		language = {"name":"Español", "code":"es"};
	}
	settings.setVariable('currency', settings.getVariable('currency') || {"name":"United States Dollar", "code":"USD", "symbol":"$"});
	settings.setVariable('language', settings.getVariable('language') || language);
	
	//Language
	var languagePath = 'locale/{0}.json'.format(settings.getVariable('language').code);
	if (languagePath!='locale/en.json') {
		$.getJSON(languagePath, function(response){
			_.setTranslation(response);
		});
	}	
		
	//>>excludeStart("build", true);
    //system.debug(true);
	 //>>excludeEnd("build");

    app.title = _('Gosh');

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true
    });

    app.start().then(function() {
        viewLocator.useConvention();
		$.when(list.initialize(), product.initialize(), purchase.initialize())
			.done(function(){
				app.setRoot('viewmodels/shell', 'entrance');
			});
    });
});