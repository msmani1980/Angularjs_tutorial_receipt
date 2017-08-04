'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MenuEditCtrl
 * @description
 * # MenuEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuEditCtrl', function ($scope, $routeParams, messageService, menuFactory, dateUtility, $location, lodash, $q) {

    var $this = this;

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
      $scope.menuItemList = [];
    }

    $scope.shouldDisableItemSelect = function (menuIndex) {
      return !$scope.filteredItemsCollection[menuIndex];
    };

    $scope.isViewOnly = function () {
      return $routeParams.state === 'view';
    };

    $scope.isMenuReadOnly = function () {
      if ($routeParams.state === 'create' || (angular.isUndefined($scope.menu))) {
        return false;
      }

      if ($routeParams.state === 'view') {
        return true;
      }

      return !dateUtility.isAfterTodayDatePicker($scope.menu.startDate);
    };

    $scope.isMenuEditable = function () {
      if ($routeParams.state === 'create') {
        return true;
      }

      if ($routeParams.state === 'view' || angular.isUndefined($scope.menu)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker($scope.menu.startDate);
    };

    function redirectToListPageAfterSuccess() {
      hideLoadingModal();
      $location.path('menu-list');
    }

    this.formatMenuItemsForAPI = function () {
      var itemsArray = [];
      var menuId = $scope.menu.id;

      angular.forEach($scope.menuItemList, function (menuItem) {
        if (menuItem.selectedItem && (menuItem.itemQty || menuItem.itemQty === 0)) {
          var itemPayload = {};
          if (menuId) {
            itemPayload.menuId = menuId;
          }

          if (menuItem.id) {
            itemPayload.id = menuItem.id;
          }

          itemPayload.itemId = menuItem.selectedItem.id;
          itemPayload.itemQty = parseInt(menuItem.itemQty);
          itemsArray.push(itemPayload);
        }
      });

      return itemsArray;
    };

    this.createPayload = function () {
      var payload = {
        companyId: $scope.menu.companyId,
        endDate: $scope.menu.endDate,
        startDate: $scope.menu.startDate,
        menuName: $scope.menu.menuName,
        menuCode: $scope.menu.menuCode,
        description: $scope.menu.description || '',
        menuItems: $this.formatMenuItemsForAPI()
      };
      if ($scope.menu.id) {
        payload.id = $scope.menu.id;
      }

      if ($scope.menu.menuId) {
        payload.menuId = $scope.menu.menuId;
      }

      return payload;
    };

    function checkToOverwriteOrCreate(response) {
      var duplicateExists = response.menus.length;
      var dateIsInTheFuture = false;
      if (duplicateExists) {
        dateIsInTheFuture = dateUtility.isAfterTodayDatePicker(response.menus[0].startDate);
      }

      if (duplicateExists && !dateIsInTheFuture) {
        hideLoadingModal();
        $scope.errorCustom = [{
          field: 'Menu Name Duplicate',
          value: 'a menu with this name and code already exist and cannot be overwritten'
        }];
        $scope.displayError = true;
      } else if (duplicateExists && dateIsInTheFuture) {
        hideLoadingModal();
        $scope.menuToOverwrite = response.menus[0];
        angular.element('#overwrite-modal').modal('show');
      } else {
        var payload = $this.createPayload();
        menuFactory.createMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
      }
    }

    function checkForDuplicateRecord() {
      menuFactory.getMenuList({
        menuCode: $scope.menu.menuCode,
        menuName: $scope.menu.menuName
      }).then(checkToOverwriteOrCreate);
    }

    this.editMenu = function () {
      var payload = $this.createPayload();
      menuFactory.updateMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
    };

    this.createMenu = function () {
      checkForDuplicateRecord();
    };

    $scope.overwriteMenu = function () {
      showLoadingModal('Saving Menu');
      $scope.menu.id = $scope.menuToOverwrite.id;
      $scope.menu.menuId = $scope.menuToOverwrite.menuId;
      $this.editMenu();
    };

    this.validateForm = function() {
      $scope.displayError = !$scope.menuEditForm.$valid;
      return $scope.menuEditForm.$valid;
    };

    $scope.submitForm = function () {
      if (!$this.validateForm()) {
        return false;
      }

      showLoadingModal('Saving Menu');
      var submitFunctionName = $routeParams.state + 'Menu';
      if ($this[submitFunctionName]) {
        $this[submitFunctionName]();
      }
    };

    function getAllSelectedItemIds() {
      var allSelectedItems = [];
      angular.forEach($scope.menuItemList, function (menuItem) {
        if (menuItem.selectedItem) {
          allSelectedItems.push(menuItem.selectedItem.id);
        }
      });

      return allSelectedItems;
    }

    $scope.filterAllItemLists = function () {
      var selectedItemIds = getAllSelectedItemIds();
      angular.forEach($scope.filteredItemsCollection, function (itemCollection) {
        angular.forEach(itemCollection, function (item) {
          item.selected = selectedItemIds.indexOf(item.id) >= 0;
        });
      });
    };

    $scope.removeItem = function (menuIndex) {
      $scope.menuEditForm.$setDirty();

      $scope.menuItemList.splice(menuIndex, 1);
      $scope.filteredItemsCollection.splice(menuIndex, 1);
      $scope.selectedCategories.splice(menuIndex, 1);

      angular.forEach($scope.menuItemList, function (menuItem, index) {
        menuItem.menuIndex = index;
      });

      $scope.filterAllItemLists();
    };

    $scope.addItem = function () {
      if (!$scope.menu.startDate && !$scope.menu.endDate) {
        messageService.display('warning', 'Add Menu Item', 'Please select a date range first!');
        return;
      }

      var nextIndex = $scope.menuItemList.length;
      $scope.menuItemList.push({ menuIndex: nextIndex });
      $scope.filteredItemsCollection.push(angular.copy($scope.masterItemList));
      $scope.selectedCategories.push(null);
      $scope.filterAllItemLists();
    };

    function setFilteredItemsCollection(dataFromAPI, menuIndex) {
      $scope.filteredItemsCollection[menuIndex] = angular.copy(dataFromAPI.masterItems);
      if (!$scope.menuItemList[menuIndex].selectedItem) {
        return;
      }

      var itemMatch = lodash.findWhere($scope.filteredItemsCollection[menuIndex], { id: $scope.menuItemList[menuIndex].selectedItem.id });
      if (!itemMatch) {
        $scope.menuItemList[menuIndex].selectedItem = null;
      }
    }

    function getFilteredMasterItemsByCategory(menuIndex) {
      var selectedCategory = $scope.selectedCategories[menuIndex];
      if (!selectedCategory) {
        $scope.filteredItemsCollection[menuIndex] = angular.copy($scope.masterItemList);
        return;
      }

      $scope.filteredItemsCollection[menuIndex] = null;
      var searchPayload = {
        startDate: $scope.menu.startDate,
        endDate: $scope.menu.endDate,
        categoryId: selectedCategory.id
      };

      menuFactory.getItemsList(searchPayload, true).then(function (response) {
        setFilteredItemsCollection(response, menuIndex);
      }, showErrors);
    }

    $scope.filterItemListByCategory = function (menuIndex) {
      getFilteredMasterItemsByCategory(menuIndex);
    };

    function setFilteredMasterItems(dataFromAPI) {
      hideLoadingModal();
      $scope.masterItemList = angular.copy(dataFromAPI.masterItems);
      angular.forEach($scope.menuItemList, function (menuItem) {
        $scope.filterItemListByCategory(menuItem.menuIndex);
      });
    }

    function getFilteredMasterItems(startDate, endDate) {
      showLoadingModal('Loading items');
      var searchPayload = {
        startDate: startDate,
        endDate: endDate
      };

      menuFactory.getItemsList(searchPayload, true).then(setFilteredMasterItems, showErrors);
    }

    function deserializeMenuItems(masterItemList) {
      $scope.menuItemList = [];
      angular.forEach($scope.menu.menuItems, function (item, index) {
        var itemMatch = lodash.findWhere(masterItemList, { id: item.itemId });
        var newItem = {
          itemQty: item.itemQty,
          id: item.id,
          menuIndex: index,
          selectedItem: itemMatch
        };
        $scope.menuItemList.push(newItem);
      });
    }

    function completeInit(responseCollection) {
      $scope.categories = angular.copy(responseCollection[0].salesCategories);
      if (angular.isDefined(responseCollection[1])) {
        $scope.menu = angular.copy(responseCollection[2]);
        deserializeMenuItems(angular.copy(responseCollection[1].masterItems));
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
      $scope.masterItemList = [];
      $scope.menuItemList = [];
      $scope.selectedCategories = [];
      $scope.filteredItemsCollection = [];
      $scope.minDate = dateUtility.dateNumDaysAfterTodayFormattedDatePicker(1);
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
        getFilteredMasterItems($scope.menu.startDate, $scope.menu.endDate);
      }
    });
    
    $scope.isCurrentEffectiveDate = function (menuDate) {
      return (dateUtility.isTodayOrEarlierDatePicker(menuDate.startDate) && dateUtility.isAfterTodayDatePicker(menuDate.endDate));
    };
    
  });
