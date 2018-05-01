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
                                                           itemTypesService, voucherDurationsService, priceTypesService, characteristicsService,
                                                           unitsService, companyDiscountService) {

  // Items
  this.getItem = function (id) {
    return itemsService.getItem(id);
  };

  this.getItemsList = function (payload, fetchFromMaster) {
    return itemsService.getItemsList(payload, fetchFromMaster);
  };

  this.createItem = function (payload, isCloneAction) {
    return itemsService.createItem(payload, isCloneAction);
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

  // Voucher Duration
  this.getVoucherDurationsList = function (payload) {
    return voucherDurationsService.getVoucherDurationsList(payload);
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

    // Voucher Duration
    getVoucherDurationsList: this.getVoucherDurationsList,

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
