'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuAssignmentCtrl
 * @description
 * # MenuAssignmentCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuAssignmentCtrl', function (
    $scope, dateUtility, messageService, menuAssignmentFactory, companiesFactory, menuMasterService, itemsFactory, $location, $routeParams, $q, lodash
  ) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Menu Assignment';
    $scope.readOnly = false;
    $scope.isEdit = false;
    $scope.company = { };
    $scope.menuMasters = { };
    $scope.menuAssignment = { };
    $scope.formData = {
      selectedMenus: [],
      selectedItems: []
    };

    $scope.addMenu = function (cabinClass) {
      $scope.formData.selectedMenus[cabinClass].push({ });
    };

    $scope.removeMenu = function (cabinClass, menu) {
      var index = $scope.formData.selectedMenus[cabinClass].indexOf(menu);
      $scope.formData.selectedMenus[cabinClass].splice(index, 1);
    };

    $scope.addItem = function (cabinClass) {
      $scope.formData.selectedItems[cabinClass].push({ });
    };

    $scope.removeItem = function (cabinClass, menu) {
      var index = $scope.formData.selectedItems[cabinClass].indexOf(menu);
      $scope.formData.selectedItems[cabinClass].splice(index, 1);
    };

    $scope.formSave = function () {

    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.viewInit = function() {
      $scope.viewName = 'View Menu Assignment';
      $scope.readOnly = true;
    };

    this.editInit = function() {
      $scope.viewName = 'Edit Menu Assignment';
      $scope.isEdit = true;
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Create Menu Assignment', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Menu Assignment', 'success');
      }

      $location.path('menu-assignment-list');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.getMenuMasterAndItemsList = function() {
      var scheduleDate = dateUtility.formatDateForAPI($scope.menuAssignment.scheduleDate);
      var payload = { startDate: scheduleDate, endDate: scheduleDate };

      $q.all([
        menuMasterService.getMenuMasterList(payload),
        itemsFactory.getItemsList(payload)
      ]).then($this.getMenuMasterAndItemsListSuccess);
    };

    this.getMenuMasterAndItemsListSuccess = function(dataFromAPI) {
      $scope.menuMasters = angular.copy(dataFromAPI[0].companyMenuMasters);
      $scope.items = angular.copy(dataFromAPI[1].retailItems);

      $this.constructSelectedMenus();
      $this.constructSelectedItems();

      $this.hideLoadingModal();
    };

    this.getMenuAssignmentSuccess = function(dataFromAPI) {
      $scope.menuAssignment = angular.copy(dataFromAPI);

      angular.extend($scope.menuAssignment, {
        startDate: dateUtility.formatDateForApp($scope.menuAssignment.startDate),
        endDate: dateUtility.formatDateForApp($scope.menuAssignment.endDate),
        scheduleDate: dateUtility.formatDateForApp($scope.menuAssignment.scheduleDate)
      });
    };

    this.getCompanySuccess = function(dataFromAPI) {
      $scope.company = angular.copy(dataFromAPI);
    };

    this.constructSelectedMenus = function() {
      $scope.company.companyCabinClasses.forEach(function (cabinClass) {
        $scope.formData.selectedMenus[cabinClass.id] = lodash.filter($scope.menuAssignment.menus, { companyCabinClassId: cabinClass.id });

        $scope.formData.selectedMenus[cabinClass.id].forEach(function(menu) {
          menu.menu = lodash.find($scope.menuMasters, { id: menu.menuId });
          if (!menu.menu) {
            menu.expired = true;
          }
        });
      });
    };

    this.constructSelectedItems = function () {
      $scope.company.companyCabinClasses.forEach(function (cabinClass) {
        $scope.formData.selectedItems[cabinClass.id] = lodash.filter($scope.menuAssignment.items, { companyCabinClassId: cabinClass.id });

        $scope.formData.selectedItems[cabinClass.id].forEach(function(item) {
          item.item = lodash.find($scope.items, { itemMasterId: item.itemId });
          if (!item.item) {
            item.expired = true;
          }
        });
      });
    };

    this.initDependenciesSuccess = function(result) {
      $this.getMenuAssignmentSuccess(result[0]);
      $this.getCompanySuccess(result[1]);

      $this.getMenuMasterAndItemsList();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
    };

    this.makeInitPromises = function() {
      companyId = menuAssignmentFactory.getCompanyId();

      var promises = [
        menuAssignmentFactory.getMenuAssignment($routeParams.id),
        companiesFactory.getCompany(companyId)
      ];

      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();
  });
