'use strict';
/*global moment*/
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
    $scope.newItemList = [];
    var $this = this;


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
    }

    function fetchMasterItemsList(startDate, endDate) {
      startDate = dateUtility.formatDateForAPI(startDate);
      endDate = dateUtility.formatDateForAPI(endDate);
      menuFactory.getItemsList({
        startDate: startDate,
        endDate: endDate
      }, true).then(attachItemsModelToScope);
    }

    function setupMenuModelAndFetchItems(menuFromAPI) {
      $scope.menuFromAPI = angular.copy(menuFromAPI);

      fetchMasterItemsList($scope.menuFromAPI.startDate, $scope.menuFromAPI.endDate);
      $scope.menu = angular.copy(menuFromAPI);
      $scope.menuEditForm.$setPristine();
    }

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function redirectToListPageAfterSuccess(dataFromAPI) {
      $location.path('menu-list').search({newMenuName: dataFromAPI.id});
    }

    function resetModelAndShowNotification(dataFromAPI) {
      setupMenuModelAndFetchItems(dataFromAPI);
      showToast('success', 'Menu', 'successfully updated!');
    }

    function showErrors(dataFromAPI) {
      showToast('warning', 'Menu', 'error updating menu!');

      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      setupMenuModelAndFetchItems($scope.menuFromAPI);
    }

    function showAPIErrors() {
      showToast('warning', 'Menu', 'API unavailable');
    }

    $scope.showDeleteConfirmation = function (itemToDelete) {
      $scope.itemToDelete = itemToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

    $this.addNewItems = function () {
      var ItemsArray = [];
      var menuId = $scope.menu.id;
      angular.forEach($scope.newItemList, function (item) {
        if (angular.isDefined(item.masterItem) && angular.isDefined(item.itemQty)) {
          var itemObject = {
            itemId: item.masterItem.id,
            itemQty: parseInt(item.itemQty)
          };
          if (menuId) {
            itemObject.menuId = menuId;
          }
          ItemsArray.push(itemObject);
        }
      });
      return ItemsArray;
    };

    $this.clearCurrentItems = function () {
      var itemsArray = [];
      angular.forEach($scope.menu.menuItems, function (item) {
        var itemObject = {
          id: item.id,
          itemId: item.itemId,
          itemQty: item.itemQty,
          sortOrder: item.sortOrder
        };
        if (item.menuId) {
          itemObject.menuId = item.menuId;
        }
        itemsArray.push(itemObject);
      });
      return itemsArray;
    };

    $this.createPayload = function () {
      var payload = {
        companyId: $scope.menu.companyId,
        description: $scope.menu.description,
        endDate: $scope.menu.endDate,
        menuCode: $scope.menu.menuCode,
        menuId: $scope.menu.menuId ? $scope.menu.menuId : null,
        menuItems: $this.clearCurrentItems().concat($this.addNewItems()),
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
      var payload = $this.createPayload();
      eval($routeParams.state + 'Menu')(payload);

    };

    function editMenu(payload) {
      menuFactory.updateMenu(payload).then(resetModelAndShowNotification, showErrors);
    }

    function createMenu(payload) {
      menuFactory.createMenu(payload).then(redirectToListPageAfterSuccess, showErrors);
    }

    $scope.deleteItemFromMenu = function () {
      angular.element('.delete-warning-modal').modal('hide');

      $scope.menu.menuItems = $scope.menu.menuItems.filter(function (item) {
        return item.itemId !== $scope.itemToDelete.itemId;
      });

      $scope.menuEditForm.$setDirty();
    };

    $scope.isViewOnly = function () {
      return ($routeParams.state === 'view');
    };

    $scope.isMenuReadOnly = function () {
      if (angular.isUndefined($scope.menu)) {
        return false;
      }
      if ($routeParams.state === 'view') {
        return true;
      }
      return !dateUtility.isAfterToday($scope.menu.startDate);
    };

    $scope.isMenuReadOnly = function () {
      if ($routeParams.state == 'create' || (angular.isUndefined($scope.menu))) {
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
        $scope.newItemList.push({});
      } else {
        showToast('warning', 'Add Menu Item', 'Please select a date range first!');
      }
    };

    $scope.deleteNewItem = function (itemIndex) {
      $scope.newItemList.splice(itemIndex, 1);
    };

    $scope.$watchGroup(['menu.startDate', 'menu.endDate'], function () {
      if ($scope.menu && $scope.menu.startDate && $scope.menu.endDate) {
        fetchMasterItemsList($scope.menu.startDate, $scope.menu.endDate);
      }
    });

    function initializeMenu() {
      if ($routeParams.id) {
        menuFactory.getMenu($routeParams.id).then(setupMenuModelAndFetchItems, showAPIErrors);
      } else {
        var companyId = menuFactory.getCompanyId();
        $scope.menu = {
          startDate: '',
          endDate: '',
          companyId: companyId
        };
      }
    }

    initializeMenu();

  })
;
