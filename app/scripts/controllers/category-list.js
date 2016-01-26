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

    function hideFilterPanel() {
      angular.element('#search-collapse').addClass('collapse');
    }

    function showFilterPanel() {
      angular.element('#search-collapse').removeClass('collapse');
    }

    function hideCreatePanel() {
      angular.element('#create-collapse').addClass('collapse');
    }

    function showCreatePanel() {
      angular.element('#create-collapse').removeClass('collapse');
    }

    $scope.toggleFilterPanel = function () {
      if (angular.element('#search-collapse').hasClass('collapse')) {
        showFilterPanel();
        hideCreatePanel();
      } else {
        hideFilterPanel();
      }
    };

    $scope.toggleCreatePanel = function () {
      if (angular.element('#create-collapse').hasClass('collapse')) {
        showCreatePanel();
        hideFilterPanel();
      } else {
        hideCreatePanel();
      }
    };

    $scope.doesCategoryHaveChildren = function (category) {
      return parseInt(category.childCategoryCount);
    };

    $scope.getClassForRow = function (category) {
      if ($scope.isUserFiltering()) {
        return '';
      }

      if ($scope.inRearrangeMode && category.id === $scope.categoryToMove.id) {
        return 'bg-info';
      }

      var styleLevel = (parseInt(category.levelNum) > 10) ? '10' : category.levelNum;
      return 'categoryLevel' + styleLevel;

    };

    $scope.getToggleButtonClass = function (category) {
      var btnDefaultClass = 'btn btn-xs ';
      return (category.isOpen) ? btnDefaultClass + 'btn-info' : btnDefaultClass + 'btn-default';
    };

    $scope.getToggleIconClass = function (category) {
      return (category.isOpen) ? 'fa fa-angle-down' : 'fa fa-angle-right';
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
      var shouldStayOpen = category.parentId === null || $scope.isUserFiltering();
      var shouldOpen = shouldStayOpen || isChildCategoryVisible(category);
      return shouldOpen;
    };

    $scope.isUserFiltering = function () {
      var isNameFiltering = lodash.has($scope.filter, 'name') && ($scope.filter.name.length > 0);
      var isDescriptionFiltering = lodash.has($scope.filter, 'description') && ($scope.filter.description.length > 0);
      return isNameFiltering || isDescriptionFiltering;
    };

    $scope.canDeleteCategory = function (category) {
      var containsNoChildren = category.childCategoryCount === null || parseInt(category.childCategoryCount) <= 0;
      var containsNoItems = parseInt(category.itemCount) <= 0;
      return containsNoChildren && containsNoItems;
    };

    $scope.enterRearrangeMode = function (category) {
      $scope.cancelEditMode();
      $scope.inRearrangeMode = true;
      $scope.categoryToMove = angular.copy(category);
    };

    $scope.enterEditMode = function (category) {
      $scope.cancelRearrangeMode();
      $scope.inEditMode = true;
      $scope.categoryToEdit = angular.copy(category);
    };

    $scope.canEditOrRearrangeCategory = function (category) {
      if ($scope.inEditMode) {
        return category.id === $scope.categoryToEdit.id;
      } else if ($scope.inRearrangeMode) {
        return category.id === $scope.categoryToMove.id;
      }

      return false;
    };

    $scope.clearCreateForm = function () {
      $scope.newCategory = {};
    };

    $scope.clearSearchForm = function () {
      $scope.filter = {};
    };

    function swapCategoryPositions(firstIndex, firstIndexNumChildren, secondIndex) {
      var tempCategoryList = angular.copy($scope.categoryList);
      $scope.categoryList.splice(firstIndex, firstIndexNumChildren + 1);
      for (var i = 0; i <= firstIndexNumChildren; i++) {
        var categoryToAdd = tempCategoryList[firstIndex + i];
        $scope.categoryList.splice(secondIndex + i, 0, categoryToAdd);
      }
    }

    function getNextCategoryIndex (startIndex) {
      var currCategory = $scope.categoryList[startIndex];
      for (var i = startIndex + 1; i < $scope.categoryList.length; i++) {
        var nextCategory = $scope.categoryList[i];
        if (nextCategory.levelNum === currCategory.levelNum && nextCategory.parentId === currCategory.parentId) {
          return i;
        }
      }

      return -1;
    }

    function setNewNextId (newIndex) {
      var nextIndex = getNextCategoryIndex(newIndex);
      $scope.categoryList[newIndex].nextCategoryId = (nextIndex >= 0) ? $scope.categoryList[nextIndex].id : null;
    }

    $scope.rearrangeCategory = function (category, index, direction) {
      var destinationIndex = (direction === 'up') ? index : (index + category.totalChildCount + 1);
      var categoryToMoveIndex = lodash.findIndex($scope.categoryList, { id: $scope.categoryToMove.id });
      destinationIndex = (destinationIndex > categoryToMoveIndex) ? (destinationIndex - $scope.categoryToMove.totalChildCount - 1) : destinationIndex;
      swapCategoryPositions(categoryToMoveIndex, $scope.categoryToMove.totalChildCount, destinationIndex);
      setNewNextId(destinationIndex);
    };

    $scope.isCategorySelectedToRearrange = function (category) {
      return $scope.inRearrangeMode && category.id === $scope.categoryToMove.id;
    };

    $scope.canRearrange = function (category) {
      if ($scope.inRearrangeMode) {
        return category.levelNum === $scope.categoryToMove.levelNum && category.id !== $scope.categoryToMove.id && category.parentId === $scope.categoryToMove.parentId;
      }
      
      return false;
    };

    function formatCategoryPayloadForAPI(categoryToFormat) {
      var newCategory = {
        name: categoryToFormat.name || categoryToFormat.categoryName,
        description: categoryToFormat.description,
        parentId: categoryToFormat.parentId || null,
        nextCategoryId: categoryToFormat.nextCategoryId || null
      };

      if (categoryToFormat.id) {
        newCategory.id = categoryToFormat.id;
      }

      return newCategory;
    }

    function getTotalChildCount(category) {
      var totalChildCount = 0;
      angular.forEach(category.children, function (childCategory) {
        totalChildCount += getTotalChildCount(childCategory) + 1;
      });

      return totalChildCount;
    }

    function formatCategoryForApp(category) {
      var currentLevelNum = category.salesCategoryPath.split('/').length;
      var newCategory = {
        id: category.id,
        name: category.name || category.categoryName,
        childCategoryCount: category.childCategoryCount,
        totalChildCount: getTotalChildCount(category),
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

    function sortCategories(categoryList) {
      var bottomCategory = lodash.findWhere(categoryList, { nextCategoryId: null });
      var newCategoryList = (bottomCategory) ? [bottomCategory] : [];

      for (var i = 0; i < newCategoryList.length; i++) {
        var currCategory = newCategoryList[i];
        currCategory.children = sortCategories(angular.copy(currCategory.children));
        var nextCategory = lodash.findWhere(categoryList, { nextCategoryId: currCategory.id });
        if (nextCategory) {
          newCategoryList.push(nextCategory);
        }
      }

      return newCategoryList.reverse();
    }

    function attachCategoryListToScope(categoryListFromAPI) {
      var categoryList = sortCategories(angular.copy(categoryListFromAPI.salesCategories));
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
      $scope.inRearrangeMode = false;
      $scope.categoryToMove = {};
      $scope.displayError = false;
    }

    function init() {
      initFreshData();
      showLoadingModal('Loading Data');
      categoryFactory.getCategoryList({ expand: true, parentId: 0 }).then(attachCategoryListToScope);
    }

    $scope.removeRecord = function (category) {
      showLoadingModal('Deleting Category ...');
      categoryFactory.deleteCategory(category.id).then(init, showErrors);
    };

    $scope.createCategory = function () {
      if ($scope.newCategoryForm.$valid) {
        $scope.newCategory.parentId = ($scope.newCategory.parentCategory) ? $scope.newCategory.parentCategory.id : null;
        $scope.newCategory.nextCategoryId = ($scope.newCategory.nextCategory) ? $scope.newCategory.nextCategory.id : null;
        var newCategory = formatCategoryPayloadForAPI($scope.newCategory);
        showLoadingModal('Creating Category');
        categoryFactory.createCategory(newCategory).then(init, showErrors);
      }
    };

    $scope.saveEditChange = function (category) {
      category.name = $scope.categoryToEdit.name || category.name;
      category.description = $scope.categoryToEdit.description || category.description;

      var newCategory = formatCategoryPayloadForAPI(category);
      showLoadingModal('Editing Category');
      categoryFactory.updateCategory(category.id, newCategory).then(init, showErrors);
    };

    $scope.saveRearrangeChange = function (category) {
      var newCategory = formatCategoryPayloadForAPI(category);
      showLoadingModal('Editing Category');
      categoryFactory.updateCategory(category.id, newCategory).then(init, showErrors);
    };

    $scope.saveChange = function (category) {
      if ($scope.inEditMode) {
        $scope.saveEditChange(category);
      } else {
        $scope.saveRearrangeChange(category);
      }
    };

    $scope.cancelEditMode = function () {
      $scope.categoryToEdit = null;
      $scope.inEditMode = false;
    };

    $scope.cancelRearrangeMode = function () {
      $scope.categoryToMove = {};
      $scope.inRearrangeMode = false;
      init();
    };

    $scope.cancelChange = function () {
      if ($scope.inEditMode) {
        $scope.cancelEditMode();
      } else {
        $scope.cancelRearrangeMode();
      }
    };

    init();
  });
