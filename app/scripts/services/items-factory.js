// TODO:
// Add CRUD methods for items
// Write tests for this factory

'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsFactory
 * @description
 * # itemsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemsFactory', function ($resource, ENV, itemsService, allergensService,itemTypesService,priceTypesService,characteristicsService,unitsService) {

  	// Items
  var getItem = function (id) {
		return itemsService.getItem(id);
	};

	var getItemsList = function (payload) {
		return itemsService.getItemsList(payload);
	};

  var createItem = function (payload) {
		return itemsService.createItem(payload);
	};

  var updateItem = function (payload) {
		return itemsService.updateItem(payload);
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

	// Units
	var getDimensionList = function (payload) {
		return unitsService.getDimensionList(payload);
	};
	var getVolumeList = function (payload) {
		return unitsService.getVolumeList(payload);
	};

	var getWeightList = function (payload) {
		return unitsService.getWeightList(payload);
	};

	return {

		// Items
		getItem: getItem,
		getItemsList: getItemsList,
    createItem:createItem,
    updateItem: updateItem,

		// Allergens
		getAllergensList: getAllergensList,

		// Item Types
		getItemTypesList: getItemTypesList,

		// Price Types
		getPriceTypesList: getPriceTypesList,

		// Characteristics
		getCharacteristicsList: getCharacteristicsList,

		// Units
		getDimensionList: getDimensionList,
		getVolumeList:getVolumeList,
		getWeightList:getWeightList


	};

});
