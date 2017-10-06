'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:MenuAssignmentCtrl
 * @description
 * # MenuAssignmentCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('MenuAssignmentCtrl', function ($scope, dateUtility, messageService, menuAssignmentFactory, companiesFactory, menuMasterService, $location, $routeParams, $q) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Menu Assignment';
    $scope.readOnly = false;
    $scope.isCreate = false;
    $scope.isEdit = false;
    $scope.company = { };
    $scope.menuMasters = { };
    $scope.menuAssignment = {
      menus: [],
      items: []
    };

    $scope.addMenu = function () {

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

    this.createInit = function() {
      $scope.viewName = 'Create Menu Assignment';
      $scope.isCreate = true;
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

    this.getMenuAssignmentSuccess = function(dataFromAPI) {
      $scope.menuAssignment = angular.copy(dataFromAPI);


    };

    this.getCompanySuccess = function(dataFromAPI) {
      $scope.company = angular.copy(dataFromAPI);
    };

    this.getMenuMasterListSuccess = function(dataFromAPI) {
      $scope.menuMasters = angular.copy(dataFromAPI.companyMenuMasters);
    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        menuAssignmentFactory.getMenuAssignment($routeParams.id).then($this.getMenuAssignmentSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
    };

    this.makeInitPromises = function() {
      companyId = menuAssignmentFactory.getCompanyId();
      var todaysDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());

      var promises = [
        companiesFactory.getCompany(companyId).then($this.getCompanySuccess),
        menuMasterService.getMenuMasterList({ startDate: todaysDate }).then($this.getMenuMasterListSuccess)
        //scheduleFactory.getStationList(companyId).then($this.getStationsSuccess),
        //scheduleFactory.getCarrierTypes(companyId).then($this.getCarrierTypesSuccess),
        //unitsService.getDistanceList().then($this.getDistanceUnitsSuccess)
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
