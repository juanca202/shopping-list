require.config({
    baseUrl: 'libraries/',
    paths: {
        jquery: 'jquery/jquery-2.0.3.min',
		bootstrap: 'bootstrap/js/bootstrap.min',
		knockoutjs: 'knockoutjs/knockout-2.3.0'
    },
	shim: {
        bootstrap: ["jquery"]
    }
});