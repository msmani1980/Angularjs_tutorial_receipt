// TODO:
// Add CRUD methods for companies
// Write tests for this factory

'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companiesFactory', function (companiesService,tagsService, salesCategoriesService,taxTypesService,stationsService) {

  // Companies
  var getCompany = function (id) {
    return companiesService.getCompany(id);
  };

  var getCompaniesList = function (payload) {
    return companiesService.getCompaniesList(payload);
  };

  // Tags
  var getTagsList = function (payload) {
    return tagsService.getTagsList(payload);
  };

  // Sales Categories
  var getSalesCategoriesList = function (payload) {
    return salesCategoriesService.getSalesCategoriesList(payload);
  };

  var getSalesCategory = function (id) {
    return salesCategoriesService.getSalesCategory(id);
  };

  var createSalesCategory = function (payload) {
    return salesCategoriesService.createSalesCategory(payload);
  };

  var updateSalesCategory = function (payload) {
    return salesCategoriesService.updateSalesCategory(payload);
  };

  // Tax Types
  var getTaxTypesList = function (payload) {
    return taxTypesService.getTaxTypesList(payload);
  };

  // Tax Types
  var getStationsList = function (payload) {
    return stationsService.getStationsList(payload);
  };

  return {

    // Companies
    getCompany: getCompany,
    getCompaniesList: getCompaniesList,

    // Tags
    getTagsList: getTagsList,

    // Sales Categories
    getSalesCategoriesList: getSalesCategoriesList,
    getSalesCategory: getSalesCategory,
    createSalesCategory:createSalesCategory,
    updateSalesCategory: updateSalesCategory,

    // Tax Types
    getTaxTypesList: getTaxTypesList,

    // Stations
    getStationsList: getStationsList

  };

});
