'use strict';
/*global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:MenuListCtrl
 * @description
 * # MenuListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuListCtrl', function ($scope, $location, menuService, ngToast) {
    $scope.viewName = 'Menu Management';
    $scope.search = {};
    $scope.importDropdown = [{
      text: 'Upload'
    }, {
      text: 'Download Template'
    }];
    $scope.modal = null;
    $scope.modals = [{
      type: 'excel',
      url: 'https://s3.amazonaws.com/ts5-dev-portal-images/templates/scheduleUpload.xlsx'
    }];

    function formatDates(menuArray) {
      var formattedMenuArray = angular.copy(menuArray);
      angular.forEach(formattedMenuArray, function (menu) {
        var formatFromAPI = 'YYYY-MM-DD';
        menu.startDate = moment(menu.startDate, formatFromAPI).format('L').toString();
        menu.endDate = moment(menu.endDate, formatFromAPI).format('L').toString();
      });
      return formattedMenuArray;
    }

    function serializeDates(payload) {
      var formattedPayload = angular.copy(payload),
        datePickerFormat = 'MM/DD/YYYY',
        serializedFormat = 'YYYYMMDD';
      if (formattedPayload.startDate) {
        formattedPayload.startDate = moment(formattedPayload.startDate, datePickerFormat).format(serializedFormat).toString();
      }
      if (formattedPayload.endDate) {
        formattedPayload.endDate = moment(formattedPayload.endDate, datePickerFormat).format(serializedFormat).toString();
      }
      return formattedPayload;
    }

    $scope.showMenu = function (menu) {
      $location.path('menu-edit/' + menu.id);
    };

    $scope.searchMenus = function () {
      menuService.getMenuList(serializeDates($scope.search)).then(attachMenuListToScope);
    };

    function showErrors(dataFromAPI) {
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      $scope.displayError = true;
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Menu Management</strong>: error deleting menu!'
      });
    }

    function successDeleteHandler() {
      $scope.searchMenus();
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Menu Management</strong>: successfully deleted menu!'
      });
    }

    $scope.deleteMenu = function () {
      angular.element('.delete-warning-modal').modal('hide');
      menuService.deleteMenu($scope.menuToDelete.id).then(successDeleteHandler, showErrors);
    };
    $scope.showExcelDownload = function () {
      $scope.modal = $scope.modals[0];
      debugger;
      angular.element('bs-modal').modal('show');
    };
    $scope.showDeleteConfirmation = function (menuToDelete) {
      $scope.menuToDelete = menuToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.isMenuEditable = function (menu) {
      var isGreaterThanToday = moment(menu.endDate, 'L').format('L') <= moment().format('L');
      return isGreaterThanToday;
    };

    $scope.isMenuReadOnly = function (menu) {
      if (angular.isUndefined(menu)) {
        return false;
      }
      var todayDate = moment().format('L');
      var startDateBeforeToday = moment(menu.startDate, 'L').format('L') < todayDate;
      var endDateBeforeToday = moment(menu.endDate, 'L').format('L') < todayDate;
      return startDateBeforeToday || endDateBeforeToday;
    };

    var attachMenuListToScope = function (menuListFromAPI) {
      $scope.menuList = formatDates(menuListFromAPI.menus);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchMenus();
    };

    menuService.getMenuList().then(attachMenuListToScope);
  });
