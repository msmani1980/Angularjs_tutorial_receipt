'use strict';

/**
 * @ngdoc service
 * @name ts5App.itemsFactory
 * @description
 * # itemsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('itemsFactory', function ($resource, baseUrl, itemsService) {

  	var getItem = function (id) {
		return itemsService.getItem(id);
	};

	var getItemsList = function (payload) {
		return itemsService.getItemsList(payload);
	};

	/*var getItemType = function (id) {
		return itemsTypesService.getItemType(id);
	};

	var getItemTypesList = function (payload) {
		return itemsTypesService.getItemTypesList(payload);
	};*/

	return {
		getItem: getItem,
		getItemsList: getItemsList,
	//	getItemType: getItemType,
	//	getItemTypesList: getItemTypesList
	};

});