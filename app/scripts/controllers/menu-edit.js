'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MenuEditCtrl
 * @description
 * # MenuEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuEditCtrl', function ($scope, $routeParams, messageService, menuFactory, dateUtility, $location, lodash, $q, $filter, $http) {

    var $this = this;
    $scope.selectedIndex = 0;
    $scope.lookUpDialog = false;
    $scope.isDateChanged = true;
    $scope.masterItemTotalList = [];

    $scope.cloningItem = false;

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function showMasterItemsModal() {
      angular.element('#master-items').modal('show');
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    }

    $scope.isViewOnly = function () {
      return $routeParams.state === 'view';
    };

    $scope.isCopyOnly = function () {
      return $routeParams.state === 'copy';
    };

    $scope.isCreateOnly = function () {
      return $routeParams.state === 'create';
    };

    $scope.isCreate = function () {
      return $routeParams.state === 'create';
    };

    $scope.isMenuReadOnly = function () {
      if ($routeParams.state === 'create' || $routeParams.state === 'copy' ||  (angular.isUndefined($scope.menu))) {
        return false;
      }

      if ($routeParams.state === 'view') {
        return true;
      }

      return !dateUtility.isAfterTodayDatePicker($scope.menu.startDate);
    };

    $scope.isMenuViewOnly = function () {
      if ($routeParams.state === 'view') {
        return true;
      }

      return false;
    };

    $scope.isMenuEditable = function () {
      if ($routeParams.state === 'create' || $routeParams.state === 'copy') {
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
        if (menuItem.itemQty || menuItem.itemQty === 0) {
          var itemPayload = {};
          if (menuItem.id && !$scope.cloningItem) {
            itemPayload.menuId = menuId;
            itemPayload.id = menuItem.id;
          }

          itemPayload.itemId = menuItem.itemId;
          itemPayload.itemQty = parseInt(menuItem.itemQty);
          itemPayload.sortOrder = parseInt(menuItem.sortOrderIndex);
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
      if ($scope.menu.id && !$scope.cloningItem) {
        payload.id = $scope.menu.id;
      }

      if ($scope.menu.menuId && !$scope.cloningItem) {
        payload.menuId = $scope.menu.menuId;
      }

      return payload;
    };

    this.editMenu = function () {
      var payload = $this.createPayload();
      menuFactory.updateMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
    };

    this.createMenu = function () {
      var payload = $this.createPayload();
      menuFactory.createMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
    };

    this.copyMenu = function () {
      var payload = $this.createPayload();
      menuFactory.createMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
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

    this.setDisableMasterItem = function (itemId, flag) {
      var itemMatch = lodash.findWhere($scope.masterItemTotalList, { id: itemId });
      if (itemMatch) {
        var index = $scope.masterItemTotalList.indexOf(itemMatch);
        $scope.masterItemTotalList[index].isDisabled = flag;
      }
    };

    $scope.removeItem = function (menuIndex) {
      $scope.menuEditForm.$setDirty();
      $this.setDisableMasterItem($scope.menuItemList[menuIndex].itemId, false);
      $scope.menuItemList.splice(menuIndex, 1);
      $scope.filteredItemsCollection.splice(menuIndex, 1);
      $scope.selectedCategories.splice(menuIndex, 1);

      angular.forEach($scope.menuItemList, function (menuItem, index) {
        menuItem.menuIndex = index;
      });

      $scope.filterAllItemLists();
      $scope.hasExpiredItems = isAnyMenuItemExpired();
    };

    $scope.addItem = function () {
      if (!$scope.menu.startDate && !$scope.menu.endDate) {
        messageService.display('warning', 'Add Menu Item', 'Please select a date range first!');
        return;
      }

      var nextIndex = $scope.menuItemList.length;
      $scope.menuItemList.push({ menuIndex: nextIndex });
      $scope.filteredItemsCollection.push(angular.copy($scope.masterItemList));
      $scope.filterAllItemLists();
    };

    function setFilteredItemsCollection(dataFromAPI, menuIndex) {
      $scope.selectedCategoryItems = dataFromAPI.masterItems;
      var selectedItemIds = getAllSelectedItemIds();
      angular.forEach($scope.selectedCategoryItems, function (selectedCategoryItem) {
        selectedCategoryItem.selected = selectedItemIds.indexOf(selectedCategoryItem.id) >= 0;
      });

      $scope.filteredItemsCollection[menuIndex] = angular.copy($scope.selectedCategoryItems);
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

    this.filterMasterItemsListByCategory = function (catgryId) {
      var filterCategoryItems = [];
      angular.forEach($scope.masterItemTotalList, function (masterItem) {
        var itemMatch = lodash.findWhere(masterItem.versions, { categoryId: catgryId });
        if (itemMatch) {
          filterCategoryItems.push(masterItem);
        }
      });

      $scope.masterItemList = angular.copy(filterCategoryItems);

    };

    this.disableSelectedMenuItems = function (masterItemsList) {
      var filterSelectedItems = [];
      angular.forEach(masterItemsList, function (masterItem) {
        var itemMatch = lodash.findWhere($scope.menuItemList, { itemId: masterItem.id });
        if (itemMatch) {
          masterItem.isDisabled = true;
        }

        filterSelectedItems.push(masterItem);
      });

      return filterSelectedItems;
    };

    $scope.getUpdateBy = function (menu) {
      if (menu.updatedByPerson) {
        return menu.updatedByPerson.userName;
      }

      if (menu.createdByPerson) {
        return menu.createdByPerson.userName;
      }

      if ($scope.isCreate()) {
        return $http.defaults.headers.common.username;
      }

      return 'Unknown';
    };

    $scope.getUpdatedOn = function (menu) {
      if (!menu.createdOn) {
        return 'Unknown';
      }

      return menu.updatedOn ? dateUtility.formatTimestampForApp(menu.updatedOn) : dateUtility.formatTimestampForApp(menu.createdOn);
    };

    this.filterMasterItemsListByCategory = function (catgryId) {
      var filterCategoryItems = [];
      angular.forEach($scope.masterItemTotalList, function (masterItem) {
        var itemMatch = lodash.findWhere(masterItem.versions, { categoryId: catgryId });
        if (itemMatch) {
          filterCategoryItems.push(masterItem);
        }
      });

      $scope.masterItemList = angular.copy(filterCategoryItems);
    };

    this.disableSelectedMenuItems = function (masterItemsList) {
      var filterSelectedItems = [];
      angular.forEach(masterItemsList, function (masterItem) {
        var itemMatch = lodash.findWhere($scope.menuItemList, { itemId: masterItem.id });
        if (itemMatch) {
          masterItem.isDisabled = true;
        }

        filterSelectedItems.push(masterItem);
      });

      return filterSelectedItems;
    };

    this.setFilteredMasterItems = function (dataFromAPI) {
      hideLoadingModal();
      var filterSelectedItems = $this.disableSelectedMenuItems(dataFromAPI.masterItems);
      $scope.masterItemList = angular.copy(filterSelectedItems);
      $scope.masterItemTotalList = angular.copy(filterSelectedItems);
      if ($scope.lookUpDialog) {
        if ($scope.menuItemList[$scope.selectedIndex].name !== undefined && $scope.menuItemList[$scope.selectedIndex].name !== '') {
          $this.filterMasterItemsListByCategory($scope.menuItemList[$scope.selectedIndex].catId);
        }

        showMasterItemsModal();
        $scope.lookUpDialog = false;
      }

    };

    function getFilteredMasterItems(startDate, endDate) {
      showLoadingModal('Loading items');
      var searchPayload = {
        startDate: startDate,
        endDate: endDate
      };

      if ($scope.isMenuEditable()) {
        menuFactory.getItemsList(searchPayload, true).then($this.setFilteredMasterItems, showErrors);
      }

    }

    $scope.showSalesCategoryModal = function (menuIndex) {
      $scope.selectedIndex = menuIndex;
      angular.element('#sales-categories').modal('show');
    };

    $scope.showMasterItemsModal = function (menuIndex) {
      $scope.selectedIndex = menuIndex;
      if ($scope.masterItemTotalList.length === 0) {
        $scope.lookUpDialog = true;
        getFilteredMasterItems($scope.menu.startDate, $scope.menu.endDate);
      } else {
        if ($scope.menuItemList[$scope.selectedIndex].name === undefined || $scope.menuItemList[$scope.selectedIndex].name === '') {
          $scope.masterItemList = angular.copy($scope.masterItemTotalList);
        } else {
          $this.filterMasterItemsListByCategory($scope.menuItemList[$scope.selectedIndex].catId);
        }

        showMasterItemsModal();
      }
    };

    function isAnyMenuItemExpired() {
      return lodash.find($scope.menuItemList, { isExpired: true }) ? true : false;
    }

    $scope.filterSalesCategoriesList = function () {
      $scope.categoriesListSearch = angular.copy($scope.salesCategoryListFilterText);
    };

    $scope.filterMasterItemsList = function () {
      $scope.masterItemsListSearch = angular.copy($scope.masterItemsListFilterText);
    };

    $scope.setCategoryName = function (categoryName, id) {
      $scope.menuItemList[$scope.selectedIndex].name = categoryName;
      $scope.menuItemList[$scope.selectedIndex].catId = id;
      $scope.menuItemList[$scope.selectedIndex].itemName = '';
      $scope.menuItemList[$scope.selectedIndex].itemId = '';
      angular.element('#sales-categories').modal('hide');
    };

    $scope.setMasterItem = function (masterItem) {
      var id = masterItem.id;
      var itemName = masterItem.itemName;

      if ($scope.menuItemList[$scope.selectedIndex].itemId) {
        $this.setDisableMasterItem($scope.menuItemList[$scope.selectedIndex].itemId, false);
      }

      $scope.menuItemList[$scope.selectedIndex].itemName = itemName;
      $scope.menuItemList[$scope.selectedIndex].itemId = id;
      $scope.menuItemList[$scope.selectedIndex].isExpired = !masterItem.hasActiveItemVersions;
      $this.setDisableMasterItem(id, true);
      var itemMatch = lodash.findWhere($scope.masterItemTotalList, { id: id });
      var index = $scope.masterItemTotalList.indexOf(itemMatch);
      $scope.masterItemTotalList[index].isDisabled = true;
      angular.element('#master-items').modal('hide');

      $scope.hasExpiredItems = isAnyMenuItemExpired();
    };

    this.deserializeMenuItems = function () {
      $scope.menuItemList = [];
      angular.forEach($scope.menu.menuItems, function (item, index) {
        var newItem = {
          itemQty: item.itemQty,
          id: item.id,
          menuIndex: index,
          selectedItem: item,
          itemId: item.itemId,
          itemName: item.itemName,
          sortOrder: item.sortOrder,
          isExpired: !item.hasActiveItemVersions
        };

        $scope.menuItemList.push(newItem);
      });

      $scope.menuItemList = $filter('orderBy')($scope.menuItemList, 'sortOrder');
      $scope.hasExpiredItems = isAnyMenuItemExpired();
    };

    this.makeCompleteInitPromises = function () {
      var mkPromises = [
        menuFactory.getSalesCategoriesList({})
      ];

      return mkPromises;
    };

    this.editComplete = function (responseCollection) {
      $scope.categories = angular.copy(responseCollection[0].salesCategories);
      $scope.isDateChanged = true;
      hideLoadingModal();
    };

    this.completeInitPromises = function () {
      var edtpromises = $this.makeCompleteInitPromises();
      $q.all(edtpromises).then($this.editComplete, showErrors);
    };

    function completeInit(responseCollection) {
      if (angular.isDefined(responseCollection[0])) {
        $scope.menu = angular.copy(responseCollection[0]);

        var startDate = $scope.menu.startDate;
        var endDate = $scope.menu.endDate;

        $scope.shouldDisableStartDate = dateUtility.isTodayDatePicker(startDate) || !(dateUtility.isAfterTodayDatePicker(startDate));
        $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker(endDate);

        $scope.editingItem = true;

        $this.deserializeMenuItems();
        if ($scope.isMenuEditable()) {
          $this.completeInitPromises();
        } else {
          hideLoadingModal();
          $scope.isDateChanged = true;
        }
      } else {
        $this.completeInitPromises();
      }

      $scope.isLoadingCompleted = true;

      $scope.menuEditForm.$setPristine();
    }

    function setInitPromises() {
      var promises = [];

      if ($routeParams.id) {
        $scope.isDateChanged = false;
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
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      $scope.menu = {
        startDate: '',
        endDate: '',
        companyId: menuFactory.getCompanyId()
      };

      if ($location.path().search('/menu/copy') !== -1 && $routeParams.id) {
        $scope.cloningItem = true;
        $scope.viewName = 'Cloning Menu';
      }
    }

    function init() {
      showLoadingModal('Loading Data');
      setupData();

      var promises = setInitPromises();
      $q.all(promises).then(completeInit, showErrors);
    }

    init();

    $scope.$watchGroup(['menu.startDate', 'menu.endDate'], function () {
      if ($scope.menu && $scope.menu.startDate && $scope.menu.endDate && $scope.isMenuEditable() && $scope.isDateChanged) {
        getFilteredMasterItems($scope.menu.startDate, $scope.menu.endDate);
      }
    });

    $scope.isCurrentEffectiveDate = function (menuDate) {
      return (dateUtility.isTodayOrEarlierDatePicker(menuDate.startDate) && (dateUtility.isAfterTodayDatePicker(menuDate.endDate) || dateUtility.isTodayDatePicker(menuDate.endDate)));
    };

    var draggedMenuItemObject;
    var draggedOntoIemIndex;

    // TODO: documentation here: http://angular-dragdrop.github.io/angular-dragdrop/
    $scope.dropSuccess = function ($event, index, array) {
      if (draggedOntoIemIndex !== null && draggedMenuItemObject !== null)
      {
        var tempItemObject = array[draggedOntoIemIndex];
        array.splice(draggedOntoIemIndex, 1, draggedMenuItemObject);
        array.splice(index, 1, tempItemObject);
        draggedMenuItemObject = null;
        for (var i = 0; i < array.length; i++)
        {
          console.log('Priting the Qty>>>' + array[i].itemQty);
          array[i].sortOrderIndex = i;
          array[i].sortOrder = i;
        }
      } else
        {
          draggedMenuItemObject = null;
          draggedOntoIemIndex = null;
          messageService.display('warning', 'Please drag and drop only inside the Menu Items list', 'Drag to reorder');
        }
    };

    $scope.onDrop = function ($event, $data, index) {
      draggedOntoIemIndex = index;
      draggedMenuItemObject = $data;
    };

  });
