define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    var items = [
		{id:1, name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg', price:1.23, checked:ko.observable(false)},
		{id:2, name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg', price:1.23, checked:ko.observable(false)},
		{id:3, name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg', price:1.23, checked:ko.observable(false)},
		{id:4, name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg', price:1.23, checked:ko.observable(false)},
		{id:5, name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg', price:1.23, checked:ko.observable(false)},
		{id:6, name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg', price:1.23, checked:ko.observable(false)},
		{id:7, name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg', price:1.23, checked:ko.observable(false)},
		{id:8, name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg', price:1.23, checked:ko.observable(false)},
		{id:9, name:'Shampoo', quantity:1, unit:'Bottle', imageUrl:'images/shampoo.jpg', price:1.23, checked:ko.observable(false)},
		{id:10, name:'Dutch cheese', quantity:250, unit:'Grs.', imageUrl:'images/dutch-cheese.jpg', price:5.23, checked:ko.observable(false)}
	];
	
    return {
		items: items,
		total:ko.computed(function(){
			var total = 0;
			$.each(items, function(){
				if(this.checked()) {
					total = total+this.price;
				}
			});
			return total;
		}),
		toggleChecked: function(item){
			item.checked(!item.checked());
		},
        activate: function (id) {
            console.log('list '+id+' activated');
        },
        canDeactivate: function () {
            //the router's activator calls this function to see if it can leave the screen
            //return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        }
    };
});