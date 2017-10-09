'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuAssignmentCtrl
 * @description
 * # MenuAssignmentCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuAssignmentCtrl', function ($scope, dateUtility, messageService, menuAssignmentFactory, companiesFactory, menuMasterService, $location, $routeParams, $q, lodash) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Menu Assignment';
    $scope.readOnly = false;
    $scope.isEdit = false;
    $scope.company = { };
    $scope.menuMasters = { };
    $scope.menuAssignment = {
      menus: [],
      items: []
    };
    $scope.formData = {
      selectedMenus: [],
      selectedItems: []
    };

    $scope.addMenu = function (cabinClass) {
      $scope.formData.selectedMenus[cabinClass].push({});
    };

    $scope.removeMenu = function (cabinClass, menu) {
      var index = $scope.formData.selectedMenus[cabinClass].indexOf(menu);
      $scope.formData.selectedMenus[cabinClass].splice(index, 1);
    };

    $scope.addItem = function () {

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

    this.getMenuMasterList = function() {
      var scheduleDate = dateUtility.formatDateForAPI($scope.menuAssignment.scheduleDate);
      var menuMasterListPayload = { startDate: scheduleDate, endDate: scheduleDate };

      menuMasterService.getMenuMasterList(menuMasterListPayload).then($this.getMenuMasterListSuccess);
    };

    this.getMenuMasterListSuccess = function(dataFromAPI) {
      $scope.menuMasters = angular.copy(dataFromAPI.companyMenuMasters);

      $this.constructSelectedMenus();
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
        $scope.formData.selectedItems[cabinClass.id] = lodash.filter($scope.menuAssignment.items, { companyCabinClassId: cabinClass.id });

        $scope.formData.selectedMenus[cabinClass.id].forEach(function(menu) {
          menu.menu = lodash.find($scope.menuMasters, { id: menu.menuId });
        });
      });
    };

    this.initDependenciesSuccess = function(result) {
      $this.getMenuAssignmentSuccess(result[0]);
      $this.getCompanySuccess(result[1]);

      $this.getMenuMasterList();

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
