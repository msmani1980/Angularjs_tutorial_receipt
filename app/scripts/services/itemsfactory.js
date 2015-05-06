'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsFactory
 * @description
 * # itemsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemsFactory', function ($resource, baseUrl, itemsService, allergensService,itemTypesService,priceTypesService,characteristicsService) {

  	// Items
  	var getItem = function (id) {
		return itemsService.getItem(id);
	};

	var getItemsList = function (payload) {
		return itemsService.getItemsList(payload);
	};

	// Allergens 
	var getAllergensList = function (payload) {
		return allergensService.getAllergensList(payload);
	};

	// Item Types
	var getItemTypesList = function (payload) {
		return itemTypesService.getItemTypesList(payload);
	};

	// Price Types
	var getPriceTypesList = function (payload) {
		return priceTypesService.getPriceTypesList(payload);
	};

	// Characteristics
	var getCharacteristicsList = function (payload) {
		return characteristicsService.getCharacteristicsList(payload);
	};

	return {

		// Items
		getItem: getItem,
		getItemsList: getItemsList,

		// Allergens
		getAllergensList: getAllergensList,

		// Item Types
		getItemTypesList: getItemTypesList,

		// Price Types
		getPriceTypesList: getPriceTypesList,

		// Characteristics
		getCharacteristicsList: getCharacteristicsList,

	};

});