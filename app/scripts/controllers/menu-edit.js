'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:MenuEditCtrl
 * @description
 * # MenuEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuEditCtrl', function ($scope, $routeParams, ngToast, menuFactory, dateUtility, $location) {
    $scope.viewName = 'Menu';
    $scope.masterItemsList = [];
    $scope.menuItemList = [];
    $scope.selectedCategories = [];
    $scope.filteredItemsCollection = [];
    var $this = this;

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }


    function getMasterItemUsingId(masterItemId) {
      return $scope.masterItemsList.filter(function (masterItem) {
        return masterItem.id === masterItemId;
      })[0];
    }

    function attachItemsModelToScope(masterItemsFromAPI) {
      $scope.masterItemsList = masterItemsFromAPI.masterItems;
      angular.forEach($scope.menu.menuItems, function (menuItem) {
        menuItem.itemName = getMasterItemUsingId(menuItem.itemId).itemName;
      });

      angular.forEach($scope.filteredItemsCollection, function(itemArray, index) {
        if(angular.equals({}, $scope.selectedCategories[index])) {
          $scope.filteredItemsCollection[index] = angular.copy($scope.masterItemsList);
        } else {
          $this.filterItems(index);
        }
      });
    }

    function fetchMasterItemsList(startDate, endDate) {
      fetchFilteredItemsList(startDate, endDate, '', attachItemsModelToScope);
    }

    function fetchFilteredItemsList(startDate, endDate, category, successHandler) {
      var searchQuery = {
        startDate: startDate,
        endDate: endDate
      };
      if(category) {
        searchQuery.categoryId = category;
      }
      menuFactory.getItemsList(searchQuery, true).then(successHandler);
    }

    function setupMenuModelAndFetchItems(menuFromAPI) {
      $scope.menuFromAPI = angular.copy(menuFromAPI);

      fetchMasterItemsList($scope.menuFromAPI.startDate, $scope.menuFromAPI.endDate);
      $scope.menu = angular.copy(menuFromAPI);
      deserializeMenuItems($scope.menu.menuItems);
      $scope.menuEditForm.$setPristine();
      hideLoadingModal();
    }

    function deserializeMenuItems(menuItems) {
      angular.forEach(menuItems, function(item) {
        item.itemQty = item.itemQty.toString();
        $scope.menuItemList.push(item);
        $scope.selectedCategories.push({});
        $scope.filteredItemsCollection.push(angular.copy($scope.masterItemsList));
      });
    }

    function showToast(className, type, message) {
      hideLoadingModal();
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function redirectToListPageAfterSuccess(dataFromAPI) {
      hideLoadingModal();
      $location.path('menu-list').search({newMenuName: dataFromAPI.id});
    }

    function resetModelAndShowNotification(dataFromAPI) {
      $scope.menuItemList = [];
      setupMenuModelAndFetchItems(dataFromAPI);
      showToast('success', 'Menu', 'successfully updated!');
    }

    function showErrors(dataFromAPI) {
      showToast('warning', 'Menu', 'error updating menu!');

      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      $scope.menuItemList = [];
      setupMenuModelAndFetchItems($scope.menuFromAPI);
    }

    function showAPIErrors() {
      showToast('warning', 'Menu', 'API unavailable');
    }

    $this.formatMenuItemsForAPI = function () {
      var ItemsArray = [];
      var menuId = $scope.menu.id;

      angular.forEach($scope.menuItemList, function (item) {
        var itemObject = {};
        if(menuId && item.itemQty) {
            itemObject.menuId = menuId;
            itemObject.itemQty = parseInt(item.itemQty);
        }
        if (item.itemId && item.itemQty) {
          itemObject.id = item.id;
          itemObject.itemId = item.itemId;
          ItemsArray.push(itemObject);
        } else if(item.id && item.itemQty) {
          itemObject.itemId = item.id;
          ItemsArray.push(itemObject);
        }
      });
      return ItemsArray;
    };

    $this.createPayload = function () {
      var payload = {
        companyId: $scope.menu.companyId,
        description: $scope.menu.description,
        endDate: $scope.menu.endDate,
        menuCode: $scope.menu.menuCode,
        menuId: $scope.menu.menuId ? $scope.menu.menuId : null,
        menuItems: $this.formatMenuItemsForAPI(),
        menuName: $scope.menu.menuName,
        startDate: $scope.menu.startDate
      };
      if ($scope.menu.id) {
        payload.id = $scope.menu.id;
      }
      return payload;
    };

    $scope.submitForm = function () {
      if (!$scope.menuEditForm.$valid) {
        return false;
      }
      showLoadingModal('Saving Menu');

      var submitFunctionName = $routeParams.state + 'Menu';
      if($this[submitFunctionName]) {
        $this[submitFunctionName]();
      }
    };

    $this.editMenu = function () {
      var payload = $this.createPayload();
      menuFactory.updateMenu(payload).then(resetModelAndShowNotification, showErrors);
    };

    $this.createMenu = function () {
      checkForDuplicateRecord();
    };

    $scope.overwriteMenu = function () {
      showLoadingModal('Saving Menu');
      $scope.menu.id = $scope.overwriteMenuId;
      var payload = $this.createPayload();
      menuFactory.updateMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
    };

    function checkForDuplicateRecord() {
      menuFactory.getMenuList({
        menuCode: $scope.menu.menuCode,
        menuName: $scope.menu.menuName
      }).then(checkToOverwriteOrCreate);
    }

    function checkToOverwriteOrCreate(response) {
      var duplicateExists = response.menus.length;
      var dateIsInTheFuture = false;
      if (duplicateExists) {
        dateIsInTheFuture = dateUtility.isAfterToday(response.menus[0].startDate);
      }

      if (duplicateExists && !dateIsInTheFuture) {
        hideLoadingModal();
        showToast('danger', 'Create Menu Failure', 'a menu with this name and code already exist and cannot be overwritten');
      } else if (duplicateExists && dateIsInTheFuture) {
        hideLoadingModal();
        $scope.overwriteMenuId = response.menus[0].id;
        angular.element('#overwrite-modal').modal('show');
      } else {
        var payload = $this.createPayload();
        menuFactory.createMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
      }
    }

    $scope.isViewOnly = function () {
      return ($routeParams.state === 'view');
    };

    $scope.isMenuReadOnly = function () {
      if ($routeParams.state === 'create' || (angular.isUndefined($scope.menu))) {
        return false;
      }
      if ($routeParams.state === 'view') {
        return true;
      }
      return !dateUtility.isAfterToday($scope.menu.startDate);
    };

    $scope.isMenuEditable = function () {
      if ($routeParams.state === 'create') {
        return true;
      }
      if ($routeParams.state === 'view') {
        return false;
      }
      if (angular.isUndefined($scope.menu)) {
        return false;
      }
      return dateUtility.isAfterToday($scope.menu.startDate);
    };

    $scope.canDeleteItems = function () {
      var totalItems = $scope.menu.menuItems.length;
      return $scope.isMenuEditable() && totalItems > 1;
    };

    $scope.addItem = function () {
      if ($scope.menu && $scope.menu.startDate && $scope.menu.endDate) {
        $scope.menuItemList.push({});
        $scope.selectedCategories.push({});
        $scope.filteredItemsCollection.push(angular.copy($scope.masterItemsList));
      } else {
        showToast('warning', 'Add Menu Item', 'Please select a date range first!');
      }
    };

    $scope.updateItemsList = function(index) {
      $scope.menuItemList[index] = null;
      $this.filterItems(index);
    };

    this.filterItems = function(index) {
      if($scope.selectedCategories[index]) {
        fetchFilteredItemsList($scope.menu.startDate, $scope.menu.endDate, $scope.selectedCategories[index].id, function(response) {
          $scope.filteredItemsCollection[index] = response.masterItems;
        });
      } else {
        $scope.filteredItemsCollection[index] = $scope.masterItemsList;
      }
    };

    $scope.shouldDisableItem = function(index) {
      if(!$scope.isMenuEditable()) {
        return true;
      }
      return $scope.filteredItemsCollection[index] === null;
    };

    $scope.deleteNewItem = function (itemIndex) {
      $scope.menuItemList.splice(itemIndex, 1);
      $scope.menuEditForm.$setDirty();
    };

    $scope.$watchGroup(['menu.startDate', 'menu.endDate'], function () {
      if ($scope.menu && $scope.menu.startDate && $scope.menu.endDate) {
        fetchMasterItemsList($scope.menu.startDate, $scope.menu.endDate);
      }
    });

    function initializeMenu() {
      if ($routeParams.id) {
        showLoadingModal('Loading Data');
        menuFactory.getMenu($routeParams.id).then(setupMenuModelAndFetchItems, showAPIErrors);
      } else {
        var companyId = menuFactory.getCompanyId();
        $scope.menu = {
          startDate: '',
          endDate: '',
          companyId: companyId
        };
      }
      menuFactory.getSalesCategoriesList({}).then(function (response) {
        $scope.categories = response.salesCategories;
      });
    }

    initializeMenu();

  })
;
