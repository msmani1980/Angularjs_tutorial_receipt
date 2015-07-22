'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuListCtrl
 * @description
 * # MenuListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuListCtrl', function ($scope, $location, menuService, ngToast, dateUtility) {
    $scope.viewName = 'Menu Management';
    $scope.search = {};
    $scope.modal = null;
    $scope.displayModalImportInfo = false;

    function formatDates(menuArray) {
      var formattedMenuArray = angular.copy(menuArray);
      angular.forEach(formattedMenuArray, function (menu) {
        menu.startDate = dateUtility.formatDateForApp(menu.startDate);
        menu.endDate = dateUtility.formatDateForApp(menu.endDate);
      });
      return formattedMenuArray;
    }

    function serializeDates(payload) {
      var formattedPayload = angular.copy(payload);
      if (formattedPayload.startDate) {
        formattedPayload.startDate = dateUtility.formatDateForAPI(formattedPayload.startDate);
      }
      if (formattedPayload.endDate) {
        formattedPayload.endDate = dateUtility.formatDateForAPI(formattedPayload.endDate);
      }
      return formattedPayload;
    }

    $scope.showMenu = function (menu) {
      $location.search({});
      $location.path('menu/view/' + menu.id);
    };

    $scope.editMenu = function (menu) {
      $location.search({});
      $location.path('menu/edit/' + menu.id);
    };

    $scope.searchMenus = function () {
      menuService.getMenuList(serializeDates($scope.search)).then(attachMenuListToScope);
    };

    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function showErrors(dataFromAPI) {
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      $scope.displayError = true;
      showToast('warning', 'Menu Management', 'error deleting menu!');
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
      angular.element('#addCashBagModal').modal('show');
    };
    $scope.showDeleteConfirmation = function (menuToDelete) {
      $scope.menuToDelete = menuToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

    $scope.isMenuEditable = function (menu) {
      if (angular.isUndefined(menu)) {
        return false;
      }
      return dateUtility.isAfterToday(menu.endDate);
    };

    $scope.isMenuReadOnly = function (menu) {
      if (angular.isUndefined(menu)) {
        return false;
      }
      return !dateUtility.isAfterToday(menu.startDate);
    };

    var attachMenuListToScope = function (menuListFromAPI) {
      $scope.menuList = formatDates(menuListFromAPI.menus);
    };

    $scope.clearForm = function () {
      $scope.search = {};
      $scope.searchMenus();
    };

    function initializeList() {
      menuService.getMenuList().then(attachMenuListToScope);
      if($location.search().newMenuName) {
        showToast('success', 'Create Menu', 'successfully created menu named ' + $location.search().newMenuName);
      }
    }
    initializeList();
  });
