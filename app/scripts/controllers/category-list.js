'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CategoryListCtrl
 * @description
 * # CategoryListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CategoryListCtrl', function ($scope, $location, categoryFactory, ngToast, dateUtility, payloadUtility) {
    var $this = this;
    $scope.viewName = 'Category';
    $scope.search = {};
    $scope.categoryList = [];
    $scope.categoryToDelete = {};

    $scope.toggleAccordionView = function (category) {
      category.expanded = !category.expanded;
    };

    function createSimplifiedCategory(category) {
      var newCategory = {
        id: category.id,
        name: category.name || category.categoryName,
        childCategoryCount: category.childCategoryCount,
        itemCount: category.itemCount,
        description: category.description,
        parentId: category.parentId,
        nextCategoryId: category.nextCategoryId,
        salesCategoryPath: category.salesCategoryPath,
        countTotalSubcategories: category.countTotalSubcategories
      };
      return newCategory;
    }

    function flattenCategoriesModel(categoryArray, workingArray) {
      var numCategoryCount = 0;
      angular.forEach(categoryArray, function (category) {
        var workingCategoryCount = 0;
        var newCategory = createSimplifiedCategory(category);
        workingArray.push(newCategory);
        if (category.children && category.children.length > 0) {
          workingCategoryCount += (flattenCategoriesModel(category.children, workingArray) + 1);
        }

        numCategoryCount = (workingCategoryCount > numCategoryCount) ? workingCategoryCount : numCategoryCount;
      });
      
      return numCategoryCount;
    }

    $scope.doesCategoryHaveChildren = function (category) {
      return parseInt(category.childCategoryCount);
    };

    this.attachCategoryListToScope = function (categoryListFromAPI) {
      var categoryList = angular.copy(categoryListFromAPI.salesCategories);
      var flattenedCategoryList = [];
      $scope.numCategoryLevels = flattenCategoriesModel(categoryList, flattenedCategoryList) + 1;
      $scope.nestedCategoryList = categoryList;
      $scope.categoryList = flattenedCategoryList;
    };

    this.getCategoryList = function () {
      categoryFactory.getCategoryList({ expand: 'true', parentId: 0 }).then($this.attachCategoryListToScope);
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

    $scope.canDeleteCategory = function (category) {
      var containsNoChildren = category.childCategoryCount === null || parseInt(category.childCategoryCount) <= 0;
      var containsNoItems = parseInt(category.itemCount) <= 0;
      return containsNoChildren && containsNoItems;
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
