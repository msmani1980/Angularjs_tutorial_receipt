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
      if (!$scope.isUserFiltering()) {
        var styleLevel = (parseInt(category.levelNum) > 10) ? '10' : category.levelNum;
        return 'categoryLevel' + styleLevel;
      }
      
      return '';
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
      var shouldStayOpen = category.parentId === null || $scope.filter.name || $scope.filter.description;
      var shouldOpen = shouldStayOpen || isChildCategoryVisible(category);
      return shouldOpen;
    };

    $scope.isCategoryReadOnly = function (exchangeRate) {
      if (!exchangeRate.startDate) {
        return false;
      }

      return false;
    };

    $scope.isUserFiltering = function () {
      var isNameFiltering = $scope.filter.name && $scope.filter.name.length;
      var isDescriptionFiltering = $scope.filter.description && $scope.filter.description.length;

      return isNameFiltering || isDescriptionFiltering;
    };

    $scope.canDeleteCategory = function (category) {
      var containsNoChildren = category.childCategoryCount === null || parseInt(category.childCategoryCount) <= 0;
      var containsNoItems = parseInt(category.itemCount) <= 0;
      return containsNoChildren && containsNoItems;
    };

    $scope.enterEditMode = function (category) {
      $scope.inEditMode = true;
      $scope.categoryToEdit = angular.copy(category);
    };

    $scope.cancelEditMode = function () {
      $scope.categoryToEdit = null;
      $scope.inEditMode = false;
    };

    $scope.canEditCategory = function (category) {
      return ($scope.inEditMode && category.id === $scope.categoryToEdit.id);
    };

    $scope.clearCreateForm = function () {
      $scope.newCategory = {};
    };

    $scope.clearSearchForm = function () {
      $scope.filter = {};
    };

    function formatCategoryPayload(categoryToFormat) {
      var newCategory = {
        name: categoryToFormat.name || categoryToFormat.categoryName,
        description: categoryToFormat.description
      };
      if (categoryToFormat.id) {
        newCategory.id = categoryToFormat.id;
      }

      if (categoryToFormat.nextCategory) {
        newCategory.nextCategoryId = categoryToFormat.nextCategory.id;
      }

      if (categoryToFormat.parentCategory) {
        newCategory.parentCategoryId = categoryToFormat.parentCategory.id;
      }

      return newCategory;
    }

    function formatCategoryForApp(category) {
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
        workingArray.push(formatCategoryForApp(category));
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

    function initFreshData() {
      $scope.newCategory = {};
      $scope.filter = {};
      $scope.categoryToEdit = false;
      $scope.inEditMode = false;
      $scope.displayError = false;
    }

    function init() {
      initFreshData();
      showLoadingModal('Loading Data');
      categoryFactory.getCategoryList({ expand: 'true', parentId: 0 }).then(attachCategoryListToScope);
    }

    $scope.removeRecord = function (category) {
      showLoadingModal('Deleting Category ...');
      categoryFactory.deleteCategory(category.id).then(init, showErrors);
    };

    $scope.saveEditChange = function (category) {
      var newCategory = formatCategoryPayload($scope.categoryToEdit);
      showLoadingModal('Editing Category');
      categoryFactory.updateCategory(category.id, newCategory).then(init, showErrors);
    };

    $scope.createCategory = function () {
      if ($scope.newCategoryForm.$valid) {
        var newCategory = formatCategoryPayload($scope.newCategory);
        showLoadingModal('Creating Category');
        categoryFactory.createCategory(newCategory).then(init, showErrors);
      }

    };

    init();
  });
