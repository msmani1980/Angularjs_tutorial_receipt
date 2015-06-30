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
      $scope.menuItemsList = [];
      angular.forEach($scope.menu.menuItems, function (menuItem) {
        var masterItem = {
          itemQty: menuItem.itemQty
        };
        angular.extend(masterItem, getMasterItemUsingId(menuItem.itemId));
        $scope.menuItemsList.push(masterItem);
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

    function showSuccessMessage() {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Menu</strong>: successfully updated!'
      });
    }


    function resetModelAndShowNotification(dataFromAPI) {
      setupMenuModelAndFetchItems(dataFromAPI);
      showSuccessMessage();
    }

    function showErrors(dataFromAPI) {
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Menu</strong>: error updating menu!'
      });
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

    $scope.submitForm = function () {
      if (!$scope.menuEditForm.$valid) {
        return false;
      }
      var formatFrom = 'l',
        formatTo = 'YYYYMMDD',
        payload = angular.copy($scope.menu.toJSON());

      angular.extend(payload, localizeDates(payload, formatFrom, formatTo));
      payload.menuItems = [];
      menuService.updateMenu(payload).then(resetModelAndShowNotification, showErrors);
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
