'use strict';

/**
 * @ngdoc service
 * @name ts5App.categoryFactory
 * @description
 * # categoryFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('categoryFactory', function (GlobalMenuService, categoryService, lodash) {

    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    var getCategoryList = function (payload) {
      payload = lodash.defaults({}, payload, {id: getCompanyId()})
      return categoryService.getCategoryList(payload);
    };

    var deleteCategory = function (categoryId) {
      return categoryService.deleteCategory(categoryId);
    };

    return {
      getCategoryList: getCategoryList,
      deleteCategory: deleteCategory
    };
  });
