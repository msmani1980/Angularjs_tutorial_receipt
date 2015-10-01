'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataCtrl
 * @description
 * # CommissionDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataCtrl', function ($scope, $routeParams) {
    var $this             = this;
    $scope.viewName       = 'Creating Commission Data';
    $scope.commissionData = {};
    $scope.baseCurrency   = 'GBP'; // TODO: get from API
    $scope.readOnly     = true;
    var percentTypeName = 'Percentage';
    var percentTypeUnit = '%';

    $scope.updateCommissionPercent = function () {
      $scope.commissionPercentDisabled        = ($scope.commissionData.commissionPayable === 'Retail Item')
      $scope.commissionData.commissionPercent = 0;
    };

    $scope.updateManualBars = function () {
      if ($scope.commissionData.manualBarsType === percentTypeName) {
        $scope.manualBarsUnit      = percentTypeUnit;
        $scope.manualBarsCharLimit = 5;
      } else {
        $scope.manualBarsUnit      = $scope.baseCurrency;
        $scope.manualBarsCharLimit = 10;
      }
    };

    $scope.updateIncentiveIncrement = function () {
      if ($scope.commissionData.commissionType === percentTypeName) {
        $scope.incentiveIncrementUnit      = percentTypeUnit;
        $scope.incentiveIncrementCharLimit = 5;
      } else {
        $scope.incentiveIncrementUnit      = $scope.baseCurrency;
        $scope.incentiveIncrementCharLimit = 10;
      }
    };

    $scope.createCommissionData = function () {
      // commissionFactory.createCommissionData($scope.commissionData).then(saveSuccess, showErrors);
    };

    $scope.editCommissionData = function () {
      // commissionFactory.editCommissionData($scope.commissionData).then(saveSuccess, showErrors);
    };

    $scope.submitForm = function () {
      var initFunctionName = ($routeParams.state + 'CommissionData');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
    };

    this.setCommissionData = function (data) {
      $scope.commissionData = data;
      $scope.updateManualBars();
      $scope.updateIncentiveIncrement();
    };

    this.setCrewBase = function (data) {
      $scope.crewBaseList = data;
    };

    this.setViewName = function () {
      var nameObject = {
        view: 'Viewing Commission Data',
        edit: 'Editing Commission Data'
      };
      if (nameObject[$routeParams.state]) {
        $scope.viewName = nameObject[$routeParams.state];
      }
    };


    this.init = function () {
      $scope.readOnly = $routeParams.state === 'view';
      $this.setViewName();
      $this.setCrewBase([{crewName: 'CREW'}, {crewName: 'CREW2'}]);

      // TODO: API calls to make:
      // commissionFactory.getBaseCurrency();
      // commissionFactory.getCrewBaseList().then(setCrewBase, showError);
      // commissionFactory.getCommissionData(recordId).then(setCommissionData, showError);

      if ($routeParams.id) {
        $this.setCommissionData({
          crewBase: 'CREW',
          startDate: '08/20/2020',
          endDate: '09/20/2020',
          commissionPayable: 'ePOS Sales',
          commissionPercent: 100.0,
          manualBarsType: 'Percentage',
          manualBarsValue: 100,
          cashPercent: 100,
          stockPercent: 50,
          commissionType: 'Percentage',
          commissionValue: 100
        });
      }
    };
    this.init();

  });
