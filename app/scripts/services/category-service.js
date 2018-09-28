'use strict';

/**
 * @ngdoc service
 * @name ts5App.categoryService
 * @description
 * # categoryService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('categoryService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/sales-categories/:id';
    var orderRequestURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/sales-categories/order';

    var requestParameters = {
      id: '@id',
      companyId: '@companyId'
    };

    var orderRequestParameters = {
      companyId: '@companyId'
    };

    var actions = {
      getCategory: {
        method: 'GET'
      },
      updateCategory: {
        method: 'PUT'
      },
      createCategory: {
        method: 'POST'
      },
      orderCategories: {
        method: 'POST'
      },
      getCategoryList: {
        method: 'GET'
      },
      deleteCategory: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);
    var orderRequestResource = $resource(orderRequestURL, orderRequestParameters, actions);

    var getCategory = function (payload) {
      requestParameters.id = payload.id;
      requestParameters.companyId = payload.companyId;
      return requestResource.getCategory(payload).$promise;
    };

    var updateCategory = function (id, companyId, payload) {
      requestParameters.id = id;
      requestParameters.companyId = companyId;
      return requestResource.updateCategory(payload).$promise;
    };

    var updateCategoryOrder = function (companyId, payload) {
      payload.companyId = companyId;

      return orderRequestResource.updateCategory(payload).$promise;
    };

    var createCategory = function (companyId, payload) {
      requestParameters.companyId = companyId;
      requestParameters.id = '';
      return requestResource.createCategory(payload).$promise;
    };

    var getCategoryList = function (payload) {
      requestParameters.companyId = '';
      requestParameters.id = '';
      return requestResource.getCategoryList(payload).$promise;
    };

    var deleteCategory = function (id, companyId) {
      requestParameters.companyId = companyId;
      requestParameters.id = id;
      return requestResource.deleteCategory().$promise;
    };

    return {
      getCategory: getCategory,
      updateCategory: updateCategory,
      updateCategoryOrder: updateCategoryOrder,
      createCategory: createCategory,
      getCategoryList: getCategoryList,
      deleteCategory: deleteCategory
    };
  });
