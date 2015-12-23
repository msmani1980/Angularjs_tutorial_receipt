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

    var requestURL = ENV.apiUrl + '/api/companies/:companyId/sales-categories';
    var requestParameters = {
      companyId: '@companyId'
    };

    var requestCategoryURL = ENV.apiUrl + '/api/companies/:companyId/sales-categories/:id';
    var requestCategoryParameters = {
      id: '@id',
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
      getCategoryList: {
        method: 'GET'
      },
      deleteCategory: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);
    var requestCategoryResource = $resource(requestCategoryURL, requestCategoryParameters, actions);

    var getCategory = function (payload) {
      requestCategoryParameters.id = payload.id;
      requestCategoryParameters.companyId = payload.companyId;
      return requestCategoryResource.getCategory(payload).$promise;
    };

    var updateCategory = function (id, companyId, payload) {
      requestCategoryParameters.id = id;
      requestCategoryParameters.companyId = companyId;
      return requestCategoryResource.updateCategory(payload).$promise;
    };

    var createCategory = function (companyId, payload) {
      requestParameters.companyId = companyId;
      return requestResource.createCategory(payload).$promise;
    };

    var getCategoryList = function (payload) {
      requestParameters.companyId = '';
      return requestResource.getCategoryList(payload).$promise;
    };

    var deleteCategory = function (categoryId) {
      requestParameters.companyId = '';
      return requestResource.deleteCategory({id: categoryId}).$promise;
    };

    return {
      getCategory: getCategory,
      updateCategory: updateCategory,
      createCategory: createCategory,
      getCategoryList: getCategoryList,
      deleteCategory: deleteCategory
    };
  });
