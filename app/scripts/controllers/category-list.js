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
    $scope.viewName = 'Category';
    $scope.search = {};
    $scope.categoryList = [];
    $scope.categoryToDelete = {};

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

    $scope.toggleAccordionView = function (category) {
      category.expanded = !category.expanded;
    };

    $scope.doesCategoryHaveChildren = function (category) {
      return parseInt(category.childCategoryCount);
    };

    $scope.getClassForRow = function (category) {
      return 'categoryLevel' + category.levelNum;
    };

    $scope.getToggleButtonClass = function (category) {
      var btnDefaultClass = 'btn btn-xs ';
      return (category.isOpen) ? btnDefaultClass + 'btn-info' : btnDefaultClass + 'btn-default';
    };

    $scope.getToggleIconClass = function (category) {
      return (category.isOpen) ? 'fa fa-arrow-down' : 'fa fa-arrow-right';
    };

    $scope.toggleCategory = function (category) {
      category.isOpen = !category.isOpen;
    };

    function isChildCategoryVisible(category) {
      if (category.parentId === null) {
        return category.isOpen;
      }

      var parentCategory = lodash.findWhere($scope.categoryList, { id: category.parentId });
      return parentCategory.isOpen && isChildCategoryVisible(parentCategory);
    }

    $scope.shouldShowCategory = function (category) {
      var shouldOpen = category.parentId === null || isChildCategoryVisible(category);
      return shouldOpen;
    };

    //$scope.searchCategories = function () {
    //  categoryFactory.getCategoryList(payloadUtility.serializeDates($scope.search)).then($this.attachCategoryListToScope);
    //};
    //
    //$scope.clearForm = function () {
    //  $scope.search = {};
    //  $scope.searchCategories();
    //};

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

    //$scope.showDeleteConfirmation = function (index, category) {
    //  $scope.categoryToDelete = category;
    //  $scope.categoryToDelete.rowIndex = index;
    //
    //  angular.element('.delete-warning-modal').modal('show');
    //};

    $scope.enterEditMode = function (category) {
      $scope.inEditMode = true;
      $scope.categoryToEdit = angular.copy(category);
    };

    $scope.cancelEditMode = function () {
      $scope.inEditMode = false;
      $scope.categoryToEdit = null;
    };

    $scope.canEditCategory = function (category) {
      return ($scope.inEditMode && category.id === $scope.categoryToEdit.id);
    };

    function formatNewCategoryPayload() {
      var newCategory = {
        name: $scope.newCategory.name,
        description: $scope.newCategory.description
      };
      if ($scope.newCategory.nextCategory) {
        newCategory.nextCategoryId = $scope.newCategory.nextCategory.id;
      }

      if ($scope.newCategory.parentCategory) {
        newCategory.parentCategoryId = $scope.newCategory.parentCategory.id;
      }

      console.log(newCategory);
      return newCategory;
    }
    
    function formatCategory(category) {
      var currentLevelNum = category.salesCategoryPath.split('/').length;
      var newCategory = {
        id: category.id,
        name: category.name || category.categoryName,
        childCategoryCount: category.childCategoryCount,
        itemCount: category.itemCount,
        description: category.description,
        parentId: category.parentId,
        nextCategoryId: category.nextCategoryId,
        salesCategoryPath: category.salesCategoryPath,
        countTotalSubcategories: category.countTotalSubcategories,
        levelNum: currentLevelNum,
        isOpen: false
      };
      return newCategory;
    }

    function getMaxLevelsAndFlattenCategoriesModel(categoryArray, workingArray) {
      var maxLevelsCount = 0;
      angular.forEach(categoryArray, function (category) {
        var currentLevelCount = 0;
        workingArray.push(formatCategory(category));
        if (category.children && category.children.length > 0) {
          currentLevelCount += (getMaxLevelsAndFlattenCategoriesModel(category.children, workingArray) + 1);
        }

        maxLevelsCount = (currentLevelCount > maxLevelsCount) ? currentLevelCount : maxLevelsCount;
      });

      return maxLevelsCount;
    }

    function attachCategoryListToScope(categoryListFromAPI) {
      var categoryList = angular.copy(categoryListFromAPI.salesCategories);
      var flattenedCategoryList = [];
      $scope.numCategoryLevels = getMaxLevelsAndFlattenCategoriesModel(categoryList, flattenedCategoryList) + 1;
      $scope.nestedCategoryList = categoryList;
      $scope.categoryList = flattenedCategoryList;
      hideLoadingModal();
    }

    function init() {
      showLoadingModal('Loading Data');
      categoryFactory.getCategoryList({ expand: 'true', parentId: 0 }).then(attachCategoryListToScope);
    }

    $scope.removeRecord = function (category) {
      showLoadingModal('Deleting Category ...');
      categoryFactory.deleteCategory(category.id).then(init, showErrors);
    };

    function createSuccess() {
      hideLoadingModal();
      $scope.newCateogry = {};
      $scope.inEditMode = false;
      $scope.displayError = false;
      init();
    }

    $scope.saveEditChange = function () {

    };

    $scope.createCategory = function () {
      if ($scope.newCategoryForm.$valid) {
        var newCategory = formatNewCategoryPayload();
        showLoadingModal('Creating Category');
        categoryFactory.createCategory(newCategory).then(createSuccess, showErrors);
      }

    };

    init();
  });
