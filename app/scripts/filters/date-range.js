'use strict';
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
		return function (items, startDateFilter, endDateFilter) {

			if (!startDateFilter || !endDateFilter) {
				return items;
			}

			var isStartDateAfterOrEqual = function (item, startDateFilter) {
				return Date.parse(item.startDate) >= Date.parse(startDateFilter);
			};

			var isEndDateBeforeOrEqual = function (item, endDateFilter) {
				return Date.parse(item.endDate) <= Date.parse(endDateFilter);
			};

			var filteredItems = [];

			// if the items are loaded
			if (items && items.length > 0) {
				angular.forEach(items, function (item) {
					var itemDateStart = isStartDateAfterOrEqual(item, startDateFilter);
					var itemDateEnd = isEndDateBeforeOrEqual(item, endDateFilter);

					if (itemDateStart && itemDateEnd) {
						filteredItems.push(item);
					}

				});

				return filteredItems;
			}


		};

	});
