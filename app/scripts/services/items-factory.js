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
angular.module('ts5App').factory('itemsFactory', function ($resource, ENV, itemsService, allergensService,
                                                           itemTypesService, priceTypesService, characteristicsService,
                                                           unitsService, companyDiscountService) {

  // Items
  this.getItem = function (id) {
    return itemsService.getItem(id);
  };

  this.getItemsList = function (payload, fetchFromMaster) {
    return itemsService.getItemsList(payload, fetchFromMaster);
  };

  this.createItem = function (payload) {
    return itemsService.createItem(payload);
  };

  this.updateItem = function (id, payload) {
    return itemsService.updateItem(id, payload);
  };

  this.removeItem = function (id) {
    return itemsService.removeItem(id);
  };

  // Allergens
  this.getAllergensList = function (payload) {
    return allergensService.getAllergensList(payload);
  };

  // Item Types
  this.getItemTypesList = function (payload) {
    return itemTypesService.getItemTypesList(payload);
  };

  // Price Types
  this.getPriceTypesList = function (payload) {
    return priceTypesService.getPriceTypesList(payload);
  };

  // Characteristics
  this.getCharacteristicsList = function (payload) {
    return characteristicsService.getCharacteristicsList(payload);
  };

  // Units
  this.getDimensionList = function (payload) {
    return unitsService.getDimensionList(payload);
  };
  this.getVolumeList = function (payload) {
    return unitsService.getVolumeList(payload);
  };

  this.getWeightList = function (payload) {
    return unitsService.getWeightList(payload);
  };

  this.getDiscountList = function (payload) {
    return companyDiscountService.getDiscountList(payload);
  };

  return {

    // Items
    getItem: this.getItem,
    getItemsList: this.getItemsList,
    createItem: this.createItem,
    updateItem: this.updateItem,
    removeItem: this.removeItem,

    // Allergens
    getAllergensList: this.getAllergensList,

    // Item Types
    getItemTypesList: this.getItemTypesList,

    // Price Types
    getPriceTypesList: this.getPriceTypesList,

    // Characteristics
    getCharacteristicsList: this.getCharacteristicsList,

    // Units
    getDimensionList: this.getDimensionList,
    getVolumeList: this.getVolumeList,
    getWeightList: this.getWeightList,

    getDiscountList: this.getDiscountList

  };

});
