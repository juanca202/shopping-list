define(['durandal/app', 'knockout', 'models/list'], function (app, ko, list) {
    var items = ko.observableArray(),
		Actions = function(){
			var self = this;
			self.items = [
				{name:'Update', url:'lists/{0}'},
				{name:'Remove', url:'lists', callback:function(id){
					list.remove(id).done(function(response){
						location.href = '#';	
					});
				}},
				{name:'Purchase', url:'lists/{0}/purchase'}
			],
			self.show = function(item){
				app.showDialog('viewmodels/menu', {context:item, actions:self.items});
			}
		};
	
    return {
        displayName: 'Lists',
        items: items,
		lastPurchases: ko.observableArray(),
        activate: function () {
            list.getAll()
				.done(function(response){
					items(response);
				});
        },
		actions: new Actions(),
		create: function() {
			location.href = '#lists/create/temp-{0}'.format(new Date().getTime());
		},
		purchase: function(item){
			location.href = '#lists/{0}/purchase'.format(item.id);
		},
		update: function(item){
			location.href = '#lists/{0}'.format(item.id);
		}
    };
});