'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataCtrl
 * @description
 * # CommissionDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataCtrl', function ($scope, $routeParams, commissionFactory, dateUtility, lodash, ngToast, $location) {
    var $this             = this;
    $scope.viewName       = 'Creating Commission Data';
    $scope.commissionData = {};
    $scope.baseCurrency   = 'GBP'; // TODO: get from API
    $scope.readOnly     = true;
    var percentTypeName = 'Percentage';
    var percentTypeUnit = '%';

    this.showToast = function (className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    this.showErrors = function (dataFromAPI) {
      $this.showToast('warning', 'Store Instance Packing', 'error saving items!');
      $scope.displayError = true;
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
    };

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.getNameByIdInArray = function (id, array) {
      var match = lodash.findWhere(array, {id: id});
      if(match) {
        return match.name;
      }
      return '';
    };

    $scope.updateCommissionPercent = function () {
      var commissionPayableType = $this.getNameByIdInArray($scope.commissionData.commissionPayableTypeId, $scope.commissionPayableTypes);
      if(commissionPayableType === 'Retail item') {
        $scope.commissionPercentDisabled = true;
        $scope.commissionData.commissionPercentage = '0';
      } else {
        $scope.commissionPercentDisabled = false;
      }
    };

    $scope.updateManualBars = function () {
      var manualBarsType = $this.getNameByIdInArray($scope.commissionData.manualBarsCommissionValueTypeId, $scope.discountTypes);
      if (manualBarsType === percentTypeName) {
        $scope.manualBarsCommissionUnit = percentTypeUnit;
        $scope.manualBarsCharLimit = 5;
      } else {
        $scope.manualBarsCommissionUnit = $scope.baseCurrency;
        $scope.manualBarsCharLimit = 10;
      }
    };

    $scope.updateIncentiveIncrement = function () {
      var commissionType = $this.getNameByIdInArray($scope.commissionData.commissionValueTypeId, $scope.discountTypes);
      if (commissionType === percentTypeName) {
          $scope.commissionValueUnit = percentTypeUnit;
        $scope.commissionValueCharLimit = 5;
      } else {
        $scope.commissionValueUnit = $scope.baseCurrency;
        $scope.commissionValueCharLimit = 10;
      }
    };

    $this.createPayload = function () {
      // TODO: don't send in null fields?
      var payload = angular.copy($scope.commissionData);
      payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      return payload;

      //var mockPayload = {
      //  "crewBaseTypeId": 1,
      //  "commissionPayableTypeId" : 2,
      //  "commissionPercentage" : "10.123",
      //  "manualBarsCommissionValueTypeId" : 1,
      //  "manualBarsCommissionValue" : "100.000",
      //  "discrepancyDeductionsCashPercentage" : "1.123",
      //  "discrepancyDeductionsStockPercentage" : "2",
      //  "commissionValueTypeId": 2,
      //  "commissionValue": "1234567.123",
      //  "startDate" : "20150101",
      //  "endDate": "20160101"
      //};
    };

    this.createSuccess = function () {
      $this.showToast('success', 'Create Commission Data', 'data successfully created');
      $this.hideLoadingModal();
      $location.path('commission-data-table');
    };

    this.createCommissionData = function (payload) {
      $this.showLoadingModal('creating commission data');
      commissionFactory.createCommissionData(payload).then($this.createSuccess, $this.showErrors);
    };

    this.editCommissionDataSuccess = function () {
      // TODO: use a 'success - continue editing modal instead?'
      $this.showToast('success', 'Edit Commission Data', 'data successfully saved');
      $this.hideLoadingModal();
    };

    this.editCommissionData = function (payload) {
      $this.showLoadingModal('updating commission data');
      commissionFactory.updateCommissionData(payload).then($this.editCommissionDataSuccess, $this.showErrors);
    };

    this.getCommissionDataSuccess = function (dataFromAPI) {
      $scope.commissionData = angular.copy(dataFromAPI);
      $scope.updateManualBars();
      $scope.updateIncentiveIncrement();
      $this.hideLoadingModal();
    };

    this.getCommissionData = function () {
      $this.showLoadingModal('retrieving data');
      commissionFactory.getCommissionPayableData($routeParams.id).then($this.getCommissionDataSuccess, $this.showErrors);
    };

    $scope.saveData = function () {
      var payload = $this.createPayload();
      var initFunctionName = ($routeParams.state + 'CommissionData');
      if ($this[initFunctionName]) {
        $this[initFunctionName](payload);
      }
    };

    this.getCrewBaseList = function () {
      commissionFactory.getCrewBaseTypes().then(function(dataFromAPI) {
        $scope.crewBaseList = angular.copy(dataFromAPI);
      });
    };

    this.getCommissionPayableTypes = function () {
      commissionFactory.getCommissionPayableTypes().then(function(dataFromAPI) {
        $scope.commissionPayableTypes = angular.copy(dataFromAPI);
      });
    };

    this.getDiscountTypes = function () {
      commissionFactory.getDiscountTypes().then(function(dataFromAPI) {
        $scope.discountTypes = angular.copy(dataFromAPI);
      });
    };

    this.setViewName = function () {
      var nameObject = {
        view: 'Viewing Commission Data',
        edit: 'Editing Commission Data',
        create: 'Creating Commission Data'
      };
      if (nameObject[$routeParams.state]) {
        $scope.viewName = nameObject[$routeParams.state];
      }
    };

    this.init = function () {
      $scope.readOnly = $routeParams.state === 'view';
      $this.setViewName();
      $this.getCrewBaseList();
      $this.getCommissionPayableTypes();
      $this.getDiscountTypes();

      // TODO: resolve business logic -- which base currency to use if there are multiple?
      // commissionFactory.getBaseCurrency();

      if ($routeParams.id) {
        $this.getCommissionData();
      }
    };
    this.init();

  });
