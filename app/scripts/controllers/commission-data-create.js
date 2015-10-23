'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataCtrl
 * @description
 * # CommissionDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataCtrl', function ($scope, $routeParams, commissionFactory, dateUtility, lodash) {
    var $this             = this;
    $scope.viewName       = 'Creating Commission Data';
    $scope.commissionData = {};
    $scope.baseCurrency   = 'GBP'; // TODO: get from API
    $scope.readOnly     = true;
    var percentTypeName = 'Percentage';
    var percentTypeUnit = '%';

    this.getNameByIdInArray = function (id, array) {
      var match = lodash.findWhere(array, {id: id});
      if(match) {
        return match.name;
      }
      return '';
    };

    $scope.updateCommissionPercent = function () {
      $scope.commissionPercentDisabled = ($scope.commissionData.commissionPayable === 'Retail Item');
      $scope.commissionData.commissionPercent = 0;
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
      var payload = angular.copy($scope.commissionData);
      console.log($scope.commissionData);
      payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      console.log(payload);
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

    $scope.createCommissionData = function () {
      // commissionFactory.createCommissionData($scope.commissionData).then(saveSuccess, showErrors);
    };

    $scope.editCommissionData = function () {
      // commissionFactory.editCommissionData($scope.commissionData).then(saveSuccess, showErrors);
    };

    $scope.saveData = function () {
      $this.createPayload();
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
        edit: 'Editing Commission Data'
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
        // commissionFactory.getCommissionData($routeParams.id).then(setCommissionData, showError);

        // get commission data from API
      }
    };
    this.init();

  });
