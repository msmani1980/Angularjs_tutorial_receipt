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
      payload = lodash.defaults({}, payload, { companyId: getCompanyId() });
      return categoryService.getCategoryList(payload);
    };

    var getCategory = function (id) {
      return categoryService.getCategory({ id: id, companyId: getCompanyId() });
    };

    var updateCategory = function (id, payload) {
      return categoryService.updateCategory(id, getCompanyId(), payload);
    };

    var createCategory = function (payload) {
      return categoryService.createCategory(getCompanyId(), payload);
    };

    var deleteCategory = function (categoryId) {
      return categoryService.deleteCategory(categoryId);
    };

    return {
      updateCategory: updateCategory,
      createCategory: createCategory,
      getCategory: getCategory,
      getCategoryList: getCategoryList,
      deleteCategory: deleteCategory
    };
  });
