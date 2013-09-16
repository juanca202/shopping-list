define(['durandal/app', 'knockout'], function (app, ko) {
    var items = ko.observableArray(),
		context = ko.observable();
	
	return {
		items:items,
        activate: function () {
			context(arguments[0].context);
			items(arguments[0].actions);
        }
    };
});