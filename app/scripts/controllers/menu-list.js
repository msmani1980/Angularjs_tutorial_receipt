'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuListCtrl
 * @description
 * # MenuListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuListCtrl', function ($scope, $location, menuService, ngToast, dateUtility, lodash) {
    $scope.viewName = 'Menu Management';
    $scope.search = {};
    $scope.modal = null;
    $scope.displayModalImportInfo = false;
    $scope.menuList = [];

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

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

    var attachMenuListToScope = function (menuListFromAPI) {
      $this.meta.count = $this.meta.count || menuListFromAPI.meta.count;
      var menuList = formatDates(menuListFromAPI.menus);
      $scope.menuList = $scope.menuList.concat(menuList);
      hideLoadingBar();
      loadingProgress = false;
    };

    var lastStartDate = null;
    var loadingProgress = false;
    function searchMenus(startDate) {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var query = serializeDates($scope.search);
      if (startDate) {
        query.startDate = startDate;
      } else if (!query.startDate && lastStartDate) {
        query.startDate = lastStartDate;
      }
      if (loadingProgress) {
        return;
      }
      query = lodash.assign(query, {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      showLoadingBar();
      loadingProgress = true;
      menuService.getMenuList(query).then(attachMenuListToScope);
      $this.meta.offset += $this.meta.limit;
      lastStartDate = query.startDate;
    }

    $scope.searchMenus = function () {
      lastStartDate = null;
      $scope.menuList = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      searchMenus();
    };

    $scope.clearForm = function () {
      lastStartDate = dateUtility.nowFormatted('YYYYMMDD');
      $scope.search = {};
      $scope.searchMenus();
    };

    $scope.loadMenus = function () {
      searchMenus(lastStartDate === null ? dateUtility.nowFormatted('YYYYMMDD') : null);
    };


    function showToast(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function showErrors(dataFromAPI) {
      $scope.errorResponse = dataFromAPI;
      $scope.displayError = true;
    }

    function successDeleteHandler() {
      $scope.searchMenus();
      showToast('success', 'Menu Management', 'successfully deleted menu!');
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

    function initializeList() {
      if ($location.search().newMenuName) {
        showToast('success', 'Create Menu', 'successfully created menu named ' + $location.search().newMenuName);
      }
    }

    initializeList();
  });
