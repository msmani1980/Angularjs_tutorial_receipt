'use strict';

/**
 * @ngdoc service
 * @name ts5App.salesTargetCategoryService
 * @description
 * # salesTargetCategoryService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('salesTargetCategoryService', function (ENV, $resource, globalMenuService) {
    var requestURL = ENV.apiUrl + '/rsvr/api/sales/targetcategory/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getSalesTargetCategoryList: {
        method: 'GET'
      },
      getSalesTargetCategoryById: {
        method: 'GET'
      },
      createSalesTargetCategory: {
        method: 'POST'
      },
      updateSalesTargetCategory: {
        method: 'PUT'
      },
      deleteSalesTargetCategory: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getSalesTargetCategoryList = function (payload) {
      return requestResource.getSalesTargetCategoryList(payload).$promise;
    };

    var getSalesTargetCategoryById = function (id) {
      return requestResource.getSalesTargetCategoryById({ id: id }).$promise;
    };

    var createSalesTargetCategory = function (payload) {
      payload.companyId = globalMenuService.company.get();

      return requestResource.createSalesTargetCategory(payload).$promise;
    };

    var updateSalesTargetCategory = function (payload) {
      payload.companyId = globalMenuService.company.get();

      return requestResource.updateSalesTargetCategory(payload).$promise;
    };

    var deleteSalesTargetCategory = function (id) {
      return requestResource.deleteSalesTargetCategory({ id: id }).$promise;
    };

    return {
      getSalesTargetCategoryList: getSalesTargetCategoryList,
      getSalesTargetCategoryById: getSalesTargetCategoryById,
      createSalesTargetCategory: createSalesTargetCategory,
      updateSalesTargetCategory: updateSalesTargetCategory,
      deleteSalesTargetCategory: deleteSalesTargetCategory
    };
  });
