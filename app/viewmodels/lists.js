define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    return {
        displayName: 'Lists',
        items: ko.observableArray([
			{id:1, name:'Household monthly purchases', itemsCount:45},
			{id:2, name:'Ingredients for sushi', itemsCount:4}
		]),
        activate: function () {
            console.log('lists activated');
        }
    };
});