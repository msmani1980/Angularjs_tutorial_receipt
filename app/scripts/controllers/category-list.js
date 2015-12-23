'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CategoryListCtrl
 * @description
 * # CategoryListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CategoryListCtrl', function ($scope, $location, categoryFactory, ngToast, dateUtility, payloadUtility, lodash) {
    var $this = this;
    $scope.viewName = 'Category';
    $scope.search = {};
    $scope.categoryList = [];
    $scope.categoryToDelete = {};

    $scope.toggleAccordionView = function(category) {
      category.expanded = !category.expanded;
    };

    this.attachCategoryListToScope = function (categoryListFromAPI) {
      var categoryMap = lodash.reduce(categoryListFromAPI.salesCategories, function(result, category) {
        result[category.id] = category;
        return result;
      }, {});
      lodash.forEach(categoryListFromAPI.salesCategories, function(category) {
        category.expanded = false;
        if (!lodash.isNull(category.parentId) && categoryMap[category.parentId]) {
          if (lodash.isNull(categoryMap[category.parentId].children)) {
            categoryMap[category.parentId].children = [];
          }
          categoryMap[category.parentId].children.push(category);
        }
      });
      $scope.categoryList = lodash.filter(categoryListFromAPI.salesCategories, function(category) {
          return category.parentId === null;
      });
    };

    this.getCategoryList = function () {
      categoryFactory.getCategoryList().then($this.attachCategoryListToScope);
    };

    $scope.editCategory = function (category) {
      $location.search({});
      window.location.href = '/#/category/' + category.id + '/edit';
    };

    $scope.searchCategories = function () {
      categoryFactory.getCategoryList(payloadUtility.serializeDates($scope.search)).then($this.attachCategoryListToScope);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchCategories();
    };

    $scope.isCategoryEditable = function (category) {
      if (angular.isUndefined(category)) {
        return false;
      }
      return true;
    };

    $scope.isCategoryReadOnly = function (exchangeRate) {
      if (!exchangeRate.startDate) {
        return false;
      }
      return false;
    };

    this.deleteCategory = function (categoryId) {
      categoryFactory.deleteCategory(categoryId);
    };

    $scope.showDeleteConfirmation = function (index, category) {
      $scope.categoryToDelete = category;
      $scope.categoryToDelete.rowIndex = index;

      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.deleteCategory = function () {
      angular.element('.delete-warning-modal').modal('hide');
      angular.element('#category-' + $scope.categoryToDelete.rowIndex).remove();

      $this.deleteCategory($scope.categoryToDelete.id);
    };

    this.init = function () {
      $this.getCategoryList();
    };

    this.init();
  });
