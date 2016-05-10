'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MenuEditCtrl
 * @description
 * # MenuEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuEditCtrl', function ($scope, $routeParams, messageService, menuFactory, dateUtility, $location,
                                        lodash, $q) {

    //var $this = this;

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    function showErrors(dataFromAPI) {
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
      $scope.menuItemList = [];
    }

    //
    //function getMasterItemUsingId(masterItemId) {
    //  return $scope.masterItemsList.filter(function(masterItem) {
    //    return masterItem.id === masterItemId;
    //  })[0];
    //}
    //
    //function attachItemsModelToScope(masterItemsFromAPI) {
    //  $scope.masterItemsList = angular.copy(masterItemsFromAPI.masterItems);
    //  angular.forEach($scope.menu.menuItems, function (menuItem) {
    //    menuItem.itemName = getMasterItemUsingId(menuItem.itemId).itemName;
    //  });
    //
    //  angular.forEach($scope.filteredItemsCollection, function (itemArray, index) {
    //    if (angular.equals({}, $scope.selectedCategories[index])) {
    //      $scope.filteredItemsCollection[index] = angular.copy($scope.masterItemsList);
    //    } else {
    //      $this.filterItems(index);
    //    }
    //  });
    //
    //  hideLoadingModal();
    //}

    //function fetchFilteredItemsList(startDate, endDate, category, successHandler) {
    //  var searchQuery = {
    //    startDate: startDate,
    //    endDate: endDate
    //  };
    //  if (category) {
    //    searchQuery.categoryId = category;
    //  }
    //
    //  menuFactory.getItemsList(searchQuery, true).then(successHandler);
    //}
    //
    //function fetchMasterItemsList(startDate, endDate) {
    //  fetchFilteredItemsList(startDate, endDate, '', attachItemsModelToScope);
    //}

    //
    //function deserializeMenuItems(menuItems) {
    //  angular.forEach(menuItems, function(item) {
    //    item.itemQty = item.itemQty.toString();
    //    $scope.menuItemList.push(item);
    //    $scope.filteredItemsCollection.push(angular.copy($scope.masterItemsList));
    //  });
    //}
    //
    //function setupMenuModelAndFetchItems(menuFromAPI) {
    //  $scope.menuFromAPI = angular.copy(menuFromAPI);
    //  if (angular.isDefined($scope.menuFromAPI)) {
    //    fetchMasterItemsList($scope.menuFromAPI.startDate, $scope.menuFromAPI.endDate);
    //    $scope.menu = angular.copy(menuFromAPI);
    //    deserializeMenuItems($scope.menu.menuItems);
    //    $scope.menuEditForm.$setPristine();
    //  }
    //}
    //
    //function showToast(className, type, message) {
    //  hideLoadingModal();
    //  messageService.display(className, message, type);
    //}
    //
    //function redirectToListPageAfterSuccess() {
    //  hideLoadingModal();
    //  $location.path('menu-list');
    //}
    //
    //function resetModelAndShowNotification(dataFromAPI) {
    //  $scope.menuItemList = [];
    //  setupMenuModelAndFetchItems(dataFromAPI);
    //  showToast('success', 'Menu', 'successfully updated!');
    //  redirectToListPageAfterSuccess();
    //}

    //
    //function checkToOverwriteOrCreate(response) {
    //  var duplicateExists = response.menus.length;
    //  var dateIsInTheFuture = false;
    //  if (duplicateExists) {
    //    dateIsInTheFuture = dateUtility.isAfterToday(response.menus[0].startDate);
    //  }
    //
    //  if (duplicateExists && !dateIsInTheFuture) {
    //    hideLoadingModal();
    //    $scope.errorCustom = [{
    //      field: 'Menu Name Duplicate',
    //      value: 'a menu with this name and code already exist and cannot be overwritten'
    //    }];
    //  } else if (duplicateExists && dateIsInTheFuture) {
    //    hideLoadingModal();
    //    $scope.overwriteMenuId = response.menus[0].id;
    //    angular.element('#overwrite-modal').modal('show');
    //  } else {
    //    var payload = $this.createPayload();
    //    menuFactory.createMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
    //  }
    //}
    //
    //function checkForDuplicateRecord() {
    //  menuFactory.getMenuList({
    //    menuCode: $scope.menu.menuCode,
    //    menuName: $scope.menu.menuName
    //  }).then(checkToOverwriteOrCreate);
    //}
    //
    //function filterAvailableItems() {
    //  angular.forEach($scope.menuItemList, function(menuItem, key) {
    //    if (angular.isDefined($scope.selectedCategories[key]) && $scope.selectedCategories[key].id) {
    //      return $this.filterItems(key);
    //    }
    //
    //    $scope.filteredItemsCollection[key] = lodash.filter($scope.masterItemsList, function(item) {
    //      var menuItemsList = (lodash.find($scope.menuItemList, {
    //        id: item.id
    //      }));
    //      return !menuItemsList;
    //    });
    //  });
    //
    //  $scope.filteredItemsCollectionMaster = lodash.filter($scope.masterItemsList, function(item) {
    //    var menuItemsList = (lodash.find($scope.menuItemList, {
    //      id: item.id
    //    }));
    //    return !menuItemsList;
    //  });
    //}
    //
    //
    //function filterMasterAgainstCurrentItems(response) {
    //  return lodash.filter(response.masterItems, function(item) {
    //    var menuItemsList = (lodash.find($scope.menuItemList, {
    //      id: item.id
    //    }));
    //    return !menuItemsList;
    //  });
    //}
    //
    //this.filterItems = function(index) {
    //  if ($scope.selectedCategories[index]) {
    //    fetchFilteredItemsList($scope.menu.startDate, $scope.menu.endDate, $scope.selectedCategories[index].id,
    //      function(response) {
    //        $scope.filteredItemsCollection[index] = filterMasterAgainstCurrentItems(response);
    //      });
    //
    //    if (!$scope.filteredItemsCollection[index]) {
    //      $scope.filteredItemsCollection[index] = [];
    //    }
    //
    //    return;
    //  }
    //
    //  $scope.filteredItemsCollection[index] = $scope.masterItemsList;
    //};
    //
    //this.formatMenuItemsForAPI = function() {
    //  var ItemsArray = [];
    //  var menuId = $scope.menu.id;
    //
    //  angular.forEach($scope.menuItemList, function(item) {
    //    var itemObject = {};
    //    if (menuId && item.itemQty) {
    //      itemObject.menuId = menuId;
    //    }
    //
    //    if (item.itemId && item.itemQty) {
    //      itemObject.id = item.id;
    //      itemObject.itemId = item.itemId;
    //      itemObject.itemQty = parseInt(item.itemQty);
    //      ItemsArray.push(itemObject);
    //    } else if (item.id && item.itemQty) {
    //      itemObject.itemId = item.id;
    //      itemObject.itemQty = parseInt(item.itemQty);
    //      ItemsArray.push(itemObject);
    //    }
    //  });
    //
    //  return ItemsArray;
    //};
    //
    //this.createPayload = function() {
    //  var payload = {
    //    companyId: $scope.menu.companyId,
    //    description: $scope.menu.description,
    //    endDate: $scope.menu.endDate,
    //    menuCode: $scope.menu.menuCode,
    //    menuId: $scope.menu.menuId ? $scope.menu.menuId : null,
    //    menuItems: $this.formatMenuItemsForAPI(),
    //    menuName: $scope.menu.menuName,
    //    startDate: $scope.menu.startDate
    //  };
    //  if ($scope.menu.id) {
    //    payload.id = $scope.menu.id;
    //  }
    //
    //  return payload;
    //};
    //
    //this.editMenu = function() {
    //  showLoadingModal('Saving Menu');
    //  var payload = $this.createPayload();
    //  menuFactory.updateMenu(payload).then(resetModelAndShowNotification, showErrors);
    //};
    //
    //this.createMenu = function() {
    //  checkForDuplicateRecord();
    //};
    //
    //$scope.submitForm = function() {
    //  if (!$scope.menuEditForm.$valid) {
    //    return false;
    //  }
    //
    //  showLoadingModal('Saving Menu');
    //
    //  var submitFunctionName = $routeParams.state + 'Menu';
    //  if ($this[submitFunctionName]) {
    //    $this[submitFunctionName]();
    //  }
    //};
    //
    //$scope.setAvailableItems = function() {
    //  return filterAvailableItems();
    //};
    //
    //$scope.overwriteMenu = function() {
    //  showLoadingModal('Saving Menu');
    //  $scope.menu.id = $scope.overwriteMenuId;
    //  var payload = $this.createPayload();
    //  menuFactory.updateMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
    //};
    //
    //$scope.isViewOnly = function() {
    //  return ($routeParams.state === 'view');
    //};
    //
    //$scope.isMenuReadOnly = function() {
    //  if ($routeParams.state === 'create' || (angular.isUndefined($scope.menu))) {
    //    return false;
    //  }
    //
    //  if ($routeParams.state === 'view') {
    //    return true;
    //  }
    //
    //  return !dateUtility.isAfterToday($scope.menu.startDate);
    //};
    //
    //$scope.isMenuEditable = function() {
    //  if ($routeParams.state === 'create') {
    //    return true;
    //  }
    //
    //  if ($routeParams.state === 'view') {
    //    return false;
    //  }
    //
    //  if (angular.isUndefined($scope.menu)) {
    //    return false;
    //  }
    //
    //  return dateUtility.isAfterToday($scope.menu.startDate);
    //};
    //
    //$scope.canDeleteItems = function() {
    //  var totalItems = $scope.menu.menuItems.length;
    //  return $scope.isMenuEditable() && totalItems > 1;
    //};
    //
    //$scope.addItem = function() {
    //  if ($scope.menu && $scope.menu.startDate && $scope.menu.endDate) {
    //    $scope.menuItemList.push(null);
    //    $scope.filteredItemsCollection.push(angular.copy($scope.filteredItemsCollectionMaster));
    //    $scope.setAvailableItems();
    //  } else {
    //    showToast('warning', 'Add Menu Item', 'Please select a date range first!');
    //  }
    //};
    //
    //$scope.updateItemsList = function(index) {
    //  $scope.menuItemList[index] = null;
    //  $this.filterItems(index);
    //};
    //
    //$scope.shouldDisableItem = function(index) {
    //  if (!$scope.isMenuEditable()) {
    //    return true;
    //  }
    //
    //  if (angular.isObject($scope.menuItemList[index]) && angular.isNumber($scope.menuItemList[index].id)) {
    //    return false;
    //  }
    //
    //  if (angular.isObject($scope.filteredItemsCollection[index]) && !$scope.filteredItemsCollection[index].length) {
    //    return true;
    //  }
    //
    //  if ($scope.filteredItemsCollection[index] === null) {
    //    return true;
    //  }
    //
    //  return false;
    //};
    //
    //$scope.deleteNewItem = function(index) {
    //  $scope.selectedCategories.splice(index, 1);
    //  $scope.menuItemList.splice(index, 1);
    //  $scope.menuEditForm.$setDirty();
    //  $scope.setAvailableItems();
    //};
    //
    //$scope.$watchGroup(['menu.startDate', 'menu.endDate'], function () {
    //  if ($scope.menu && $scope.menu.startDate && $scope.menu.endDate) {
    //    fetchMasterItemsList($scope.menu.startDate, $scope.menu.endDate);
    //  }
    //});
    //
    //$scope.isEndDateDisabled = function() {
    //  if ($scope.menu && $scope.menu.endDate) {
    //    var date = $scope.menu.endDate;
    //    return $scope.isViewOnly() || dateUtility.isYesterdayOrEarlier(date);
    //  }
    //
    //  return $scope.isViewOnly();
    //};

    //function initializeMenu() {
    //  if ($routeParams.id) {
    //    showLoadingModal('Loading Data');
    //    menuFactory.getMenu($routeParams.id).then(setupMenuModelAndFetchItems, showErrors);
    //  } else {
    //    var companyId = menuFactory.getCompanyId();
    //    $scope.menu = {
    //      startDate: '',
    //      endDate: '',
    //      companyId: companyId
    //    };
    //  }
    //
    //  $scope.minDate = dateUtility.dateNumDaysAfterTodayFormatted(1);
    //
    //  menuFactory.getSalesCategoriesList({}).then(function(response) {
    //    $scope.categories = angular.copy(response.salesCategories);
    //    $scope.menuEditForm.$setPristine();
    //  });
    //}
    //
    //initializeMenu();

    function setFilteredMasterItems(dataFromAPI) {
      $scope.filteredItemList = angular.copy(dataFromAPI.masterItems);
    }

    function getFilteredMasterItems(startDate, endDate, category) {
      var searchPayload = {
        startDate: startDate,
        endDate: endDate
      };

      if (category) {
        searchPayload.categoryId = category;
      }

      menuFactory.getItemsList(searchPayload, true).then(setFilteredMasterItems, showErrors);
    }

    function deserializeMenuItems() {
      $scope.menuItemList = [];
      angular.forEach($scope.menu.menuItems, function (item) {
        var itemMatch = lodash.findWhere($scope.allMasterItems, { id: item.itemId });
        $scope.menuItemList.push(itemMatch);
      });
    }

    function completeInit(responseCollection) {
      $scope.categories = angular.copy(responseCollection[0].salesCategories);
      if (angular.isDefined(responseCollection[1])) {
        $scope.menu = angular.copy(responseCollection[2]);
        $scope.allMasterItems = angular.copy(responseCollection[1].masterItems);
        deserializeMenuItems();
      }

      $scope.menuEditForm.$setPristine();
      hideLoadingModal();
    }

    function setInitPromises() {
      var promises = [
        menuFactory.getSalesCategoriesList({})
      ];

      if ($routeParams.id) {
        promises.push(menuFactory.getItemsList({}, true));
        promises.push(menuFactory.getMenu($routeParams.id));
      }

      return promises;
    }

    function setupData() {
      $scope.viewName = 'Menu';
      $scope.masterItemsList = [];
      $scope.menuItemList = [];
      $scope.selectedCategories = [];
      $scope.filteredItemsCollection = [];
      $scope.minDate = dateUtility.dateNumDaysAfterTodayFormatted(1);
      $scope.menu = {
        startDate: '',
        endDate: '',
        companyId: menuFactory.getCompanyId()
      };
    }

    function init() {
      showLoadingModal('Loading Data');
      setupData();

      var promises = setInitPromises();
      $q.all(promises).then(completeInit, showErrors);
    }

    init();

    $scope.$watchGroup(['menu.startDate', 'menu.endDate'], function () {
      if ($scope.menu && $scope.menu.startDate && $scope.menu.endDate) {
        getFilteredMasterItems($scope.menu.startDate, $scope.menu.endDate, '');
      }
    });

  });
