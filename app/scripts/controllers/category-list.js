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
    identityAccessFactory, lodash, accessService, messageService) {

    $scope.viewName = 'Category';
    $scope.search = {};
    $scope.categoryList = [];
    $scope.categoryToDelete = {};

    var dragIndexFrom;
    var dragIndexTo;

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function clearDragIndexes() {
      dragIndexFrom = null;
      dragIndexTo = null;
    }

    function updateCategoryOrder() {
      var index = 1;
      var payload = [];
      lodash.filter($scope.categoryList, { parentId: $scope.categoryToMove.parentId }).forEach(function (c) {
        payload.push({
          id: c.id,
          orderBy: index
        });
        index = index + 1;
      });

      return categoryFactory.updateCategoryOrder(payload).finally(hideLoadingModal);
    }

    $scope.dropSuccess = function (event, index) {
      event.preventDefault();

      dragIndexFrom = index;

      // Don't allow to drag outside parent group
      if (!dragIndexTo) {
        messageService.display('warning', 'Please drag and drop only inside the same parent', 'Drag to reorder');

        clearDragIndexes();
        return;
      }

      // If category index is not changed, skip ordering
      if (dragIndexFrom === dragIndexTo) {
        return;
      }

      showLoadingModal('Saving category order. Please stand by.');

      // Order and persist
      $scope.categoryToMove = $scope.categoryList[dragIndexFrom];
      $scope.droppedOnCategory = $scope.categoryList[dragIndexTo];

      $scope.rearrangeCategory($scope.droppedOnCategory, dragIndexTo, dragIndexTo > dragIndexFrom ? 'down' : 'up');

      updateCategoryOrder();
      clearDragIndexes();
    };

    $scope.onDrop = function (event, data, index) {
      dragIndexTo = index;
    };

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

    $scope.enterEditMode = function(category) {
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

    $scope.rearrangeCategory = function(category, index, direction) {
      var destinationIndex = (direction === 'up') ? index : (index + category.totalChildCount + 1);
      var categoryToMoveIndex = lodash.findIndex($scope.categoryList, {
        id: $scope.categoryToMove.id
      });
      destinationIndex = (destinationIndex > categoryToMoveIndex) ? (destinationIndex - $scope.categoryToMove.totalChildCount - 1) : destinationIndex;
      swapCategoryPositions(categoryToMoveIndex, $scope.categoryToMove.totalChildCount, destinationIndex);
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

      payloadForSearch.sortBy = 'ASC';
      payloadForSearch.sortOn = 'categoryName';

      return payloadForSearch;
    }

    function formatCategoryPayloadForAPI(categoryToFormat) {
      var newCategory = {
        name: categoryToFormat.name || categoryToFormat.categoryName,
        description: categoryToFormat.description,
        parentCategoryId: categoryToFormat.parentId || null,
        nextCategoryId: categoryToFormat.nextCategoryId || null,
        orderBy: categoryToFormat.orderBy
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
        isOpen: false,
        orderBy: category.orderBy
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

    function attachCategoryListToScope(categoryListFromAPI) {
      var categoryList = angular.copy(categoryListFromAPI.salesCategories);
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
        sortBy: 'ASC',
        sortOn: 'orderBy',
        parentId: 0
      }).then(attachCategoryListToScope);
    }

    $scope.removeRecord = function(category) {
      showLoadingModal('Deleting Category ...');
      categoryFactory.deleteCategory(category.id).then(init, showErrors);
    };

    function nextOrderBy(parentId) {
      return lodash.filter($scope.categoryList, { parentId: parentId }).length + 1;
    }

    function incrementOrderByForCategoriesAfterNewlyCreated() {
      var payload = [];
      $scope.categoriesToIncrementOrderBy.forEach(function (c) {
        payload.push({
          id: c.id,
          orderBy: c.orderBy + 1
        });
      });

      return categoryFactory.updateCategoryOrder(payload).then(init, showErrors);
    }

    function getCategoryById(id) {
      return lodash.find($scope.categoryList, { id: id });
    }

    $scope.createCategory = function() {
      if ($scope.newCategoryForm.$valid) {
        $scope.newCategory.parentId = ($scope.newCategory.parentCategory) ? $scope.newCategory.parentCategory.id : null;
        $scope.newCategory.nextCategoryId = ($scope.newCategory.nextCategory) ? $scope.newCategory.nextCategory.id : null;

        var newCategory = formatCategoryPayloadForAPI($scope.newCategory);

        $scope.categoriesToIncrementOrderBy = [];

        // Place Before is set, put before selected category and register all following to increment orderBy
        if ($scope.newCategory.nextCategoryId) {
          var categoryPlaceBefore = getCategoryById($scope.newCategory.nextCategoryId);
          newCategory.orderBy = categoryPlaceBefore.orderBy;

          // Find following categories for which orderBy needs to be incremented
          var found = false;
          $scope.categoryList.forEach(function (c) {
            if (c.id === categoryPlaceBefore.id) {
              found = true;
            }

            if (found && c.parentId === $scope.newCategory.parentId) {
              $scope.categoriesToIncrementOrderBy.push(c);
            }
          });
        }

        // Put to parent category end
        else {
          newCategory.orderBy = nextOrderBy($scope.newCategory.parentId);
        }

        showLoadingModal('Creating Category');

        categoryFactory.createCategory(newCategory).then(function() {
          if ($scope.categoriesToIncrementOrderBy.length > 0) {
            return incrementOrderByForCategoriesAfterNewlyCreated();
          } else {
            init();
          }
        }, showErrors);
      }
    };

    $scope.saveEditChange = function(category) {
      category.name = $scope.categoryToEdit.name || category.name;
      category.description = $scope.categoryToEdit.description || category.description;

      var newParentId = (angular.isDefined($scope.categoryToEdit.parentCategory) && $scope.categoryToEdit.parentCategory !==
        null) ? $scope.categoryToEdit.parentCategory.id : null;

      // Parent changed, set orderBy to the last position of that parent group
      if (newParentId !== category.parentId) {
        category.nextCategoryId = null;
        category.orderBy = nextOrderBy(newParentId);
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

      var payload = formatPayloadForSearch();

      if (payload.name || payload.description || payload.parentId) {
        $scope.isFiltering = true;
        categoryFactory.getCategoryList(payload).then(attachFilteredCategoryListToScope, showErrors);
      } else {
        $scope.isFiltering = false;
        categoryFactory.getCategoryList({
          expand: true,
          sortBy: 'ASC',
          sortOn: 'orderBy',
          parentId: 0
        }).then(attachCategoryListToScope);
      }
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
