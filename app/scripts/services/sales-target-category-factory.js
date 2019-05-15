'use strict';

/**
 * @ngdoc service
 * @name ts5App.salesTargetCategoryFactory
 * @description
 * # salesTargetCategoryFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('salesTargetCategoryFactory', function (salesTargetCategoryService) {

    function getSalesTargetCategoryList(searchParams) {
      return salesTargetCategoryService.getSalesTargetCategoryList(searchParams);
    }

    function getSalesTargetCategoryById(id) {
      return salesTargetCategoryService.getSalesTargetCategoryById(id);
    }

    function createSalesTargetCategory(payload) {
      return salesTargetCategoryService.createSalesTargetCategory(payload);
    }

    function updateSalesTargetCategory(payload) {
      return salesTargetCategoryService.updateSalesTargetCategory(payload);
    }

    function deleteSalesTargetCategory(id) {
      return salesTargetCategoryService.deleteSalesTargetCategory(id);
    }

    return {
      getSalesTargetCategoryList: getSalesTargetCategoryList,
      getSalesTargetCategoryById: getSalesTargetCategoryById,
      createSalesTargetCategory: createSalesTargetCategory,
      updateSalesTargetCategory: updateSalesTargetCategory,
      deleteSalesTargetCategory: deleteSalesTargetCategory
    }
  });
