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

    var requestURL = ENV.apiUrl + '/api/companies/:id/sales-categories';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCategoryList: {
        method: 'GET'
      },
      deleteCategory: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCategoryList = function (payload) {
      return requestResource.getCategoryList(payload).$promise;
    };

    var deleteCategory = function (categoryId) {
      return requestResource.deleteCategory({id: categoryId}).$promise;
    };

    return {
      getCategoryList: getCategoryList,
      deleteCategory: deleteCategory
    };
  });
