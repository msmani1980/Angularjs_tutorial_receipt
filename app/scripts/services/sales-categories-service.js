'use strict';

/**
 * @ngdoc service
 * @name ts5App.salesCategoriesService
 * @description
 * # salesCategoriesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('salesCategoriesService', function ($resource, ENV, globalMenuService) {

    var requestURL = ENV.apiUrl + '/api/companies/:companyId/sales-categories/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getSalesCategoriesList: {
        method: 'GET'
      },
      getSalesCategory: {
        method: 'GET'
      },
      createSalesCategory: {
        method: 'POST'
      },
      updateSalesCategory: {
        method: 'PUT'
      }
    };

    var requestResource = function () {
      requestParameters.companyId = globalMenuService.company.get();
      return $resource(requestURL, requestParameters, actions);
    };

    var getSalesCategoriesList = function (payload) {
      return requestResource().getSalesCategoriesList(payload).$promise;
    };

    var getSalesCategory = function (id) {
      return requestResource().getSalesCategory({ id: id }).$promise;
    };

    var createSalesCategory = function (payload) {
      return requestResource().createSalesCategory(payload).$promise;
    };

    var updateSalesCategory = function (payload) {
      return requestResource().updateSalesCategory(payload).$promise;
    };

    return {
      getSalesCategoriesList: getSalesCategoriesList,
      getSalesCategory: getSalesCategory,
      createSalesCategory: createSalesCategory,
      updateSalesCategory: updateSalesCategory
    };

  });
