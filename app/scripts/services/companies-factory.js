'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companiesFactory', function (tagsService, salesCategoriesService) {

  // Tags
  var getTagsList = function (payload) {
    return tagsService.getTagsList(payload);
  };

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

  return {

    // Tags
    getTagsList: getTagsList,

    // Sales Categories
    getSalesCategoriesList: getSalesCategoriesList,
    getSalesCategory: getSalesCategory,
    createSalesCategory:createSalesCategory,
    updateSalesCategory: updateSalesCategory

  };

});
