define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.
	var viewModel = function(){
		var self = this;
		self.activate = function (id) {
			if (id) {
				self.mode = 'edit';
				self.name = 'Household monthly purchases';
				self.items = ko.observableArray([
					{name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'},
					{name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg'},
					{name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg'}
				]);
			}
        };
        self.canDeactivate = function () {
            if (self.pendingChanges) {
				return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
			}else {
				return true;
			}
        };
		self.mode = 'create';
		self.pendingChanges = false;
		self.name = '';
		self.items = ko.observableArray();
	}
	
    return viewModel;
});