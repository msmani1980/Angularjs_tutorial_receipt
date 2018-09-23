'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CategoryListCtrl
 * @description
 * # CategoryListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CategoryListCtrl', function($scope, $location, categoryFactory, dateUtility, payloadUtility,
    identityAccessFactory, lodash, accessService) {

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

    $scope.dropSuccess = function (a, b, c) {
      console.log('drop success')
    }
    $scope.dropFailure = function (a, b, c) {
      console.log('drop fail')
    }

    $scope.onDrop = function (a, b, c) {
      console.log('on drop')
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

    $scope.toggleFilterPanel = function() {
      if (angular.element('#search-collapse').hasClass('collapse')) {
        showFilterPanel();
        hideCreatePanel();
      } else {
        hideFilterPanel();
      }
    };

    $scope.toggleCreatePanel = function() {
      if (angular.element('#create-collapse').hasClass('collapse')) {
        showCreatePanel();
        hideFilterPanel();
      } else {
        hideCreatePanel();
      }
    };

    $scope.doesCategoryHaveChildren = function(category) {
      return parseInt(category.childCategoryCount);
    };

    $scope.getClassForRow = function(category) {
      if ($scope.inRearrangeMode && category.id === $scope.categoryToMove.id) {
        return 'bg-info';
      }

      var styleLevel = (parseInt(category.levelNum) > 10) ? '10' : category.levelNum;
      return 'categoryLevel' + styleLevel;

    };

    $scope.getToggleButtonClass = function(category) {
      var btnDefaultClass = 'btn btn-xs ';
      return (category.isOpen) ? btnDefaultClass + 'btn-info' : btnDefaultClass + 'btn-default';
    };

    $scope.getToggleIconClass = function(category) {
      return (category.isOpen) ? 'fa fa-angle-down' : 'fa fa-angle-right';
    };

    $scope.toggleCategory = function(category) {
      category.isOpen = !category.isOpen;
    };

    function isChildCategoryVisible(category) {
      if (category.parentId === null || category.levelNum <= 1) {
        return category.isOpen;
      }

      var parentCategory = lodash.findWhere($scope.categoryList, {
        id: category.parentId,
        levelNum: category.levelNum - 1
      });

      return parentCategory.isOpen && isChildCategoryVisible(parentCategory);
    }

    $scope.shouldShowCategory = function(category) {
      var shouldStayOpen = category.parentId === null || category.levelNum <= 1;
      var shouldOpen = shouldStayOpen || isChildCategoryVisible(category);
      return shouldOpen;
    };

    $scope.canDeleteCategory = function(category) {
      var containsNoChildren = category.childCategoryCount === null || parseInt(category.childCategoryCount) <= 0;
      var containsNoItems = parseInt(category.itemCount) <= 0;
      return containsNoChildren && containsNoItems;
    };

    $scope.enterRearrangeMode = function(category) {
      $scope.cancelEditMode();
      $scope.inRearrangeMode = true;
      $scope.categoryToMove = angular.copy(category);
    };

    $scope.enterEditMode = function(category) {
      $scope.cancelRearrangeMode();
      $scope.inEditMode = true;

      $scope.filteredCategoryList = lodash.filter($scope.flatCategoryList, function(newCategory) {
        return newCategory.id !== category.id;
      });

      $scope.categoryToEdit = angular.copy(category);
      $scope.categoryToEdit.parentCategory = angular.copy(lodash.findWhere($scope.categoryList, {
        id: category.parentId
      }));
    };

    $scope.canEditOrRearrangeCategory = function(category) {
      if ($scope.inEditMode) {
        return category.id === $scope.categoryToEdit.id;
      } else if ($scope.inRearrangeMode) {
        return category.id === $scope.categoryToMove.id;
      }

      return false;
    };

    $scope.clearCreateForm = function() {
      $scope.newCategory = {};
    };

    $scope.clearNextCategoryOnParentCategorySelect = function() {
      $scope.newCategory.nextCategory = null;
    };

    function swapCategoryPositions(firstIndex, firstIndexNumChildren, secondIndex) {
      var tempCategoryList = angular.copy($scope.categoryList);
      $scope.categoryList.splice(firstIndex, firstIndexNumChildren + 1);
      for (var i = 0; i <= firstIndexNumChildren; i++) {
        var categoryToAdd = tempCategoryList[firstIndex + i];
        $scope.categoryList.splice(secondIndex + i, 0, categoryToAdd);
      }
    }

    function getNextCategoryIndex(startIndex) {
      var currCategory = $scope.categoryList[startIndex];
      for (var i = startIndex + 1; i < $scope.categoryList.length; i++) {
        var nextCategory = $scope.categoryList[i];
        if (nextCategory.levelNum === currCategory.levelNum && nextCategory.parentId === currCategory.parentId) {
          return i;
        }
      }

      return -1;
    }

    function setNewNextId(newIndex) {
      var nextIndex = getNextCategoryIndex(newIndex);
      $scope.categoryList[newIndex].nextCategoryId = (nextIndex >= 0) ? $scope.categoryList[nextIndex].id : null;
    }

    $scope.rearrangeCategory = function(category, index, direction) {
      var destinationIndex = (direction === 'up') ? index : (index + category.totalChildCount + 1);
      var categoryToMoveIndex = lodash.findIndex($scope.categoryList, {
        id: $scope.categoryToMove.id
      });
      destinationIndex = (destinationIndex > categoryToMoveIndex) ? (destinationIndex - $scope.categoryToMove.totalChildCount -
        1) : destinationIndex;
      swapCategoryPositions(categoryToMoveIndex, $scope.categoryToMove.totalChildCount, destinationIndex);
      setNewNextId(destinationIndex);
    };

    $scope.isCategorySelectedToRearrange = function(category) {
      return $scope.inRearrangeMode && category.id === $scope.categoryToMove.id;
    };

    $scope.canRearrange = function(category) {
      if ($scope.inRearrangeMode) {
        return category.levelNum === $scope.categoryToMove.levelNum && category.id !== $scope.categoryToMove.id &&
          category.parentId === $scope.categoryToMove.parentId;
      }

      return false;
    };

    function formatPayloadForSearch() {
      var payloadForSearch = {};
      if (lodash.has($scope.filter, 'name') && ($scope.filter.name.length > 0)) {
        payloadForSearch.name = $scope.filter.name;
      }

      if (lodash.has($scope.filter, 'description') && ($scope.filter.description.length > 0)) {
        payloadForSearch.description = $scope.filter.description;
      }

      if ($scope.filter.parentCategory) {
        payloadForSearch.parentId = $scope.filter.parentCategory.id;
      }

      return payloadForSearch;
    }

    function formatCategoryPayloadForAPI(categoryToFormat) {
      var newCategory = {
        name: categoryToFormat.name || categoryToFormat.categoryName,
        description: categoryToFormat.description,
        parentCategoryId: categoryToFormat.parentId || null,
        nextCategoryId: categoryToFormat.nextCategoryId || null
      };

      if (categoryToFormat.id) {
        newCategory.id = categoryToFormat.id;
      }

      return newCategory;
    }

    function getTotalChildCount(category) {
      var totalChildCount = 0;
      angular.forEach(category.children, function(childCategory) {
        totalChildCount += getTotalChildCount(childCategory) + 1;
      });

      return totalChildCount;
    }

    function formatCategoryForApp(category, currentLevel) {
      var globalLevel = category.salesCategoryPath.split('/').length;
      var parentCategoryName = category.salesCategoryPath.split('/')[globalLevel - 2] || '';

      var newCategory = {
        id: category.id,
        name: category.name || category.categoryName,
        childCategoryCount: parseInt(category.childCategoryCount) || 0,
        totalChildCount: getTotalChildCount(category),
        itemCount: category.itemCount,
        description: category.description || '',
        parentName: parentCategoryName,
        parentId: category.parentId,
        nextCategoryId: category.nextCategoryId,
        salesCategoryPath: category.salesCategoryPath,
        countTotalSubcategories: category.countTotalSubcategories,
        levelNum: currentLevel,
        isOpen: false
      };
      return newCategory;
    }

    function getMaxLevelsAndFlattenCategoriesModel(categoryArray, workingArray, levelIterator) {
      var maxLevelsCount = 0;
      angular.forEach(categoryArray, function(category) {
        var currentLevelCount = 0;
        workingArray.push(formatCategoryForApp(category, levelIterator));
        if (category.children && category.children.length > 0) {
          currentLevelCount += (getMaxLevelsAndFlattenCategoriesModel(category.children, workingArray,
            levelIterator + 1) + 1);
        }

        maxLevelsCount = (currentLevelCount > maxLevelsCount) ? currentLevelCount : maxLevelsCount;
      });

      return maxLevelsCount;
    }

    function sortCategories(categoryList) {
      var bottomCategory = lodash.findWhere(categoryList, {
        nextCategoryId: null
      });
      var newCategoryList = (bottomCategory) ? [bottomCategory] : [];

      for (var i = 0; i < newCategoryList.length; i++) {
        var currCategory = newCategoryList[i];
        currCategory.children = sortCategories(angular.copy(currCategory.children));
        var nextCategory = lodash.findWhere(categoryList, {
          nextCategoryId: currCategory.id
        });
        if (nextCategory) {
          newCategoryList.push(nextCategory);
        }
      }

      return newCategoryList.reverse();
    }

    function attachCategoryListToScope(categoryListFromAPI) {
      var categoryList = sortCategories(angular.copy(categoryListFromAPI.salesCategories));
      var flattenedCategoryList = [];
      $scope.numCategoryLevels = getMaxLevelsAndFlattenCategoriesModel(categoryList, flattenedCategoryList, 1) + 1;
      $scope.nestedCategoryList = categoryList;
      $scope.flatCategoryList = flattenedCategoryList;
      $scope.categoryList = angular.copy(flattenedCategoryList);
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
      $scope.isFiltering = false;
    }

    function init() {
      $scope.isCRUD = accessService.crudAccessGranted('RETAIL', 'RETAILITEMCATEGORY', 'CRUDRICAT');
      $scope.isSOCRUD = accessService.crudAccessGranted('STOCKOWNER', 'STOCKOWNERCATEGORY', 'CRUDSOICAT');
      initFreshData();
      showLoadingModal('Loading Data');
      categoryFactory.getCategoryList({
        expand: true,
        parentId: 0
      }).then(attachCategoryListToScope);
    }

    $scope.removeRecord = function(category) {
      showLoadingModal('Deleting Category ...');
      categoryFactory.deleteCategory(category.id).then(init, showErrors);
    };

    $scope.createCategory = function() {
      if ($scope.newCategoryForm.$valid) {
        $scope.newCategory.parentId = ($scope.newCategory.parentCategory) ? $scope.newCategory.parentCategory.id :
          null;
        $scope.newCategory.nextCategoryId = ($scope.newCategory.nextCategory) ? $scope.newCategory.nextCategory.id :
          null;
        var newCategory = formatCategoryPayloadForAPI($scope.newCategory);
        showLoadingModal('Creating Category');
        categoryFactory.createCategory(newCategory).then(init, showErrors);
      }
    };

    $scope.saveEditChange = function(category) {
      category.name = $scope.categoryToEdit.name || category.name;
      category.description = $scope.categoryToEdit.description || category.description;

      var newParentId = (angular.isDefined($scope.categoryToEdit.parentCategory) && $scope.categoryToEdit.parentCategory !==
        null) ? $scope.categoryToEdit.parentCategory.id : null;
      if (newParentId !== category.parentId) {
        category.nextCategoryId = null;
      }

      category.parentId = newParentId;
      var newCategory = formatCategoryPayloadForAPI(category);
      showLoadingModal('Editing Category');
      categoryFactory.updateCategory(category.id, newCategory).then(init, showErrors);
    };

    $scope.saveRearrangeChange = function(category) {
      var newCategory = formatCategoryPayloadForAPI(category);
      showLoadingModal('Editing Category');
      categoryFactory.updateCategory(category.id, newCategory).then(init, showErrors);
    };

    $scope.saveChange = function(category) {
      if ($scope.inEditMode) {
        $scope.saveEditChange(category);
      } else {
        $scope.saveRearrangeChange(category);
      }
    };

    $scope.cancelEditMode = function() {
      $scope.categoryToEdit = null;
      $scope.inEditMode = false;
      $scope.filteredCategoryList = null;
    };

    $scope.cancelRearrangeMode = function() {
      if ($scope.inRearrangeMode) {
        $scope.categoryToMove = {};
        $scope.inRearrangeMode = false;
        init();
      }
    };

    $scope.cancelChange = function() {
      if ($scope.inEditMode) {
        $scope.cancelEditMode();
      } else {
        $scope.cancelRearrangeMode();
      }
    };

    function getNestedCategory(categoryId, arrayToCheck) {
      if (arrayToCheck === null) {
        return null;
      }

      for (var i = 0; i < arrayToCheck.length; i++) {
        if (arrayToCheck[i].id === categoryId) {
          return arrayToCheck[i];
        }

        var childMatch = getNestedCategory(categoryId, arrayToCheck[i].children);
        if (childMatch) {
          return childMatch;
        }
      }
    }

    function attachFilteredCategoryListToScope(filteredCategoriesFromAPI) {
      var filteredNestedCategoryList = [];
      angular.forEach(angular.copy(filteredCategoriesFromAPI.salesCategories), function(category) {
        var categoryMatch = getNestedCategory(category.id, $scope.nestedCategoryList);
        if (categoryMatch) {
          filteredNestedCategoryList.push(angular.copy(categoryMatch));
        }
      });

      var flattenedFilteredList = [];
      $scope.numCategoryLevels = getMaxLevelsAndFlattenCategoriesModel(filteredNestedCategoryList,
        flattenedFilteredList, 1) + 1;
      $scope.categoryList = angular.copy(flattenedFilteredList);
      hideLoadingModal();
    }

    function hasLength(data) {
      return angular.isDefined(data) && data.length;
    }

    function searchIsDirty() {
      var s = $scope.filter;
      var check = [];
      for (var search in s) {
        if (angular.isDefined(search) && hasLength(search)) {
          check.push(search);
        }
      }

      return (check.length);
    }

    $scope.search = function() {
      showLoadingModal('Searching');

      $scope.isFiltering = true;
      var payload = formatPayloadForSearch();
      categoryFactory.getCategoryList(payload).then(attachFilteredCategoryListToScope, showErrors);
    };

    $scope.clearSearch = function() {
      $scope.filter = {};
      $scope.categoryList = [];
    };

    $scope.showClearButton = function() {
      return searchIsDirty() || hasLength($scope.categoryList);
    };

    $scope.determineLeftNavTitle = function() {
      if (identityAccessFactory.getSessionObject().companyData.companyTypeName === 'Stockowner') {
        return 'StockOwner Item Management';
      }

      if (identityAccessFactory.getSessionObject().companyData.companyTypeId === 2) {
        return 'StockOwner Item Management';
      }

      return '';
    };

    init();

  });
