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
  .controller('MenuEditCtrl', function ($scope, $routeParams, ngToast, menuFactory) {
    $scope.viewName = 'Menu';
    $scope.masterItemsList = [];
    $scope.newItemList = [];
    var $this = this;


    function formatDate(dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
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
    }

    function fetchMasterItemsList(menuFromAPI, dateFromAPIFormat, dateForAPIFormat) {
      var startDate = formatDate(menuFromAPI.startDate, dateFromAPIFormat, dateForAPIFormat);
      var endDate = formatDate(menuFromAPI.endDate, dateFromAPIFormat, dateForAPIFormat);

      menuFactory.getItemsList({
        startDate: startDate,
        endDate: endDate
      }, true).then(attachItemsModelToScope);
    }

    function localizeDates(datesContainer, formatDateFrom, formatDateTo) {
      return {
        startDate: formatDate(datesContainer.startDate, formatDateFrom, formatDateTo),
        endDate: formatDate(datesContainer.endDate, formatDateFrom, formatDateTo)
      };
    }

    function attachMenuModelAndLocalizeDates(menuFromAPI, dateFromAPIFormat) {
      $scope.menu = angular.copy(menuFromAPI);
      angular.extend($scope.menu, localizeDates($scope.menu, dateFromAPIFormat, 'L'));
      $scope.menuEditForm.$setPristine();
    }

    function setupMenuModelAndFetchItems(menuFromAPI) {
      var dateFromAPIFormat = 'YYYY-MM-DD';
      $scope.menuFromAPI = angular.copy(menuFromAPI);

      fetchMasterItemsList(menuFromAPI, dateFromAPIFormat, 'YYYYMMDD');
      attachMenuModelAndLocalizeDates(menuFromAPI, dateFromAPIFormat);
    }

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
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

    $scope.shouldShowActions = function () {
      return ($scope.menu) ? $scope.menu.menuItems.length > 1 : false;
    };

    $this.addNewItems = function () {
      var ItemsArray = [];
      var menuId = $scope.menu.id;
      angular.forEach($scope.newItemList, function (item) {
        if (angular.isDefined(item.masterItem) && angular.isDefined(item.itemQty)) {
          ItemsArray.push({
            itemId: item.masterItem.id,
            itemQty: parseInt(item.itemQty),
            menuId: menuId
          });
        }
      });
      return ItemsArray;
    };

    $this.clearCurrentItems = function () {
      var itemsArray = [];
      angular.forEach($scope.menu.menuItems, function (item) {
        itemsArray.push({
          id: item.id,
          itemId: item.itemId,
          itemQty: item.itemQty,
          menuId: item.menuId,
          sortOrder: item.sortOrder
        });
      });
      return itemsArray;
    };

    $this.createPayload = function () {
      var payload = {
        id: $scope.menu.id,
        companyId: $scope.menu.companyId,
        description: $scope.menu.description,
        endDate: $scope.menu.endDate,
        menuCode: $scope.menu.menuCode,
        menuId: $scope.menu.menuId,
        menuItems: $this.clearCurrentItems().concat($this.addNewItems()),
        menuName: $scope.menu.menuName,
        startDate: $scope.menu.startDate
      };
      return payload;
    };

    $scope.submitForm = function () {
      if (!$scope.menuEditForm.$valid) {
        return false;
      }

      var formatFrom = 'l';
      var formatTo = 'YYYYMMDD';
      var payload = $this.createPayload();

      angular.extend(payload, localizeDates(payload, formatFrom, formatTo));
      menuFactory.updateMenu(payload).then(resetModelAndShowNotification, showErrors);
    };

    $scope.deleteItemFromMenu = function () {
      angular.element('.delete-warning-modal').modal('hide');

      $scope.menu.menuItems = $scope.menu.menuItems.filter(function (item) {
        return item.itemId !== $scope.itemToDelete.itemId;
      });

      $scope.menuEditForm.$setDirty();
    };

    $scope.isMenuReadOnly = function () {
      if (angular.isUndefined($scope.menu)) {
        return false;
      }
      var todayDate = moment().format('L');
      var startDateBeforeToday = moment($scope.menu.startDate, 'L').format('L') < todayDate;
      var endDateBeforeToday = moment($scope.menu.endDate, 'L').format('L') < todayDate;
      return startDateBeforeToday || endDateBeforeToday;
    };

    $scope.addItem = function () {
      $scope.newItemList.push({});
    };

    $scope.deleteNewItem = function (itemIndex) {
      $scope.newItemList.splice(itemIndex, 1);
    };

    menuFactory.getMenu($routeParams.id).then(setupMenuModelAndFetchItems, showAPIErrors);

  })
;
