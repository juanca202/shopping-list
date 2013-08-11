require(['../libraries/common'], function (common) {
    require(['jquery', 'bootstrap', 'knockoutjs'], function($, bootstrap, ko){
		'use strict';
		
		//View model classes
		var Month = function(){
			//Private
			var _self = this;
			var _currentMonth;
			var _monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
			var _getMonthDays = function() {
				var monthTotalDays = new Date(_currentMonth.getFullYear(), _currentMonth.getMonth()+1, 0).getDate();			
				var currentDate;
				var monthDays = [];
				for (var i = 1; i<=monthTotalDays; i++) {
					currentDate = new Date(_currentMonth.getFullYear(), _currentMonth.getMonth(), i);
					monthDays.push({day:i, weekend:currentDate.getDay()==0 || currentDate.getDay()==6});
				}
				return monthDays;
			}
			
			//Public
			_self.index = ko.observable();
			_self.name = ko.observable();
			_self.year = ko.observable();
			_self.days = ko.observableArray();
			_self.getCurrent = function() {
				return _currentMonth;
			}
			_self.setCurrent = function(year, month) {
				_currentMonth = new Date(year, month);
				_self.index(_currentMonth.getMonth());	
				_self.name(_monthNames[_currentMonth.getMonth()]);
				_self.year(_currentMonth.getFullYear());
				_self.days(_getMonthDays());
			};
			_self.next = function() {
				var nextMonth = new Date(_currentMonth.getTime());
				nextMonth.setMonth(_currentMonth.getMonth()+1);
				_self.setCurrent(nextMonth.getFullYear(), nextMonth.getMonth());	
			};
			_self.previous = function() {
				var previousMonth = new Date(_currentMonth.getTime());
				previousMonth.setMonth(_currentMonth.getMonth()-1);
				_self.setCurrent(previousMonth.getFullYear(), previousMonth.getMonth());	
			};
		}
		
		window.viewModel = {
			month: new Month()
		};
		
		var today = new Date();
		viewModel.month.setCurrent(today.getFullYear(), today.getMonth());
		
		ko.applyBindings(viewModel);
		$('body').removeClass('hide');
	})
});