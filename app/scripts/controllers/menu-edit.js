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
  .controller('MenuEditCtrl', function ($scope, $routeParams, ngToast, menuService, itemsService) {
    $scope.viewName = 'Menu';
    var masterItemsList = [];


    function formatDate(dateString, formatFrom, formatTo) {
      return moment(dateString, formatFrom).format(formatTo).toString();
    }

    function getMasterItemUsingId(masterItemId) {
      return masterItemsList.filter(function (masterItem) {
        return masterItem.id === masterItemId;
      })[0];
    }

    function attachItemsModelToScope(masterItemsFromAPI) {
      masterItemsList = masterItemsFromAPI.masterItems;
      angular.forEach($scope.menu.menuItems, function (menuItem) {
        menuItem.itemName = getMasterItemUsingId(menuItem.itemId).itemName;
      });
    }

    function fetchMasterItemsList(menuFromAPI, dateFromAPIFormat, dateForAPIFormat) {
      var startDate = formatDate(menuFromAPI.startDate, dateFromAPIFormat, dateForAPIFormat);
      var endDate = formatDate(menuFromAPI.endDate, dateFromAPIFormat, dateForAPIFormat);

      itemsService.getItemsList({
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

    function showToast(className, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>Menu</strong>: ' + message
      });
    }

    function resetModelAndShowNotification(dataFromAPI) {
      setupMenuModelAndFetchItems(dataFromAPI);
      showToast('success', 'successfully updated!');
    }

    function showErrors(dataFromAPI) {
      showToast('warning', 'error updating menu!');

      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      setupMenuModelAndFetchItems($scope.menuFromAPI);
    }

    $scope.showDeleteConfirmation = function (itemToDelete) {
      $scope.itemToDelete = itemToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.shouldShowActions = function () {
      return ($scope.menu) ? $scope.menu.menuItems.length > 1 : false;
    };

    $scope.submitForm = function () {
      if (!$scope.menuEditForm.$valid) {
        return false;
      }
      var formatFrom = 'l',
        formatTo = 'YYYYMMDD',
        payload = angular.copy($scope.menu.toJSON());

      angular.extend(payload, localizeDates(payload, formatFrom, formatTo));
      menuService.updateMenu(payload).then(resetModelAndShowNotification, showErrors);
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

    menuService.getMenu($routeParams.id).then(setupMenuModelAndFetchItems);

  });
