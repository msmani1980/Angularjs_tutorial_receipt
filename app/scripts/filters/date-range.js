'use strict';
/* global moment */
/**
 * @ngdoc filter
 * @name ts5App.filter:dateRange
 * @function
 * @description
 * # dateRange
 * Filter in the ts5App.
 */
angular.module('ts5App')
	.filter('daterange', function () {
		return function(items, startDateFilter, endDateFilter) {

			if (!startDateFilter || !endDateFilter){
				return items;
			}

			var filteredDate = [];

			// if the items are loaded
			if (items && items.length > 0) {
				angular.forEach(items, function (item) {
					var itemDateStart = moment( item.startDate ).isAfter( startDateFilter ) || moment( item.startDate ).isSame( startDateFilter);
					var itemDateEnd =  moment( item.endDate ).isBefore( endDateFilter ) || moment( item.endDate ).isSame( endDateFilter);

					if (itemDateStart && itemDateEnd) {
						filteredDate.push(item);
					}

				});

				return filteredDate;
			}

		};

  });
