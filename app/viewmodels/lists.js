define(['durandal/app', 'knockout', 'models/list'], function (app, ko, list) {
    var viewModel = function() {
		var self = this;
		self.activate = function () {
            list.getAll()
				.done(function(response){
					self.items(response);
				});
        };
		self.items = ko.observableArray();
		self.lastPurchases = ko.observableArray();
		self.create = function() {
			location.href = '#lists/create';
		};
		self.purchase = function(item){
			location.href = '#lists/{0}/purchase'.format(item.id);
		};
		self.update = function(item){
			location.href = '#lists/{0}'.format(item.id);
		};
		self.show = function(item){
			app.showDialog('viewmodels/menu', {context:item, actions:self.items});
		}
	};
    return viewModel;
});