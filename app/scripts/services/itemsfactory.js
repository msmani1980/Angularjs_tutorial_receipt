'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsFactory
 * @description
 * # itemsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemsFactory', function ($resource, baseUrl, itemsService, allergensService) {

  	var getItem = function (id) {
		return itemsService.getItem(id);
	};

	var getItemsList = function (payload) {
		return itemsService.getItemsList(payload);
	};

	var getAllergensList = function (payload) {
		return allergensService.getAllergensList(payload);
	};

	return {
		getItem: getItem,
		getItemsList: getItemsList,
		getAllergensList: getAllergensList
	};

});