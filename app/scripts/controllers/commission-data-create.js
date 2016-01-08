'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataCtrl
 *
 * @description
 * # CommissionDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataCtrl', function($scope, $routeParams, commissionFactory, dateUtility, lodash, ngToast,
    $location, employeesService, GlobalMenuService, $q) {

    var $this = this;
    var companyId = GlobalMenuService.company.get();
    var percentTypeName = 'Percentage';
    var percentTypeUnit = '%';

    $scope.viewName = 'Creating Commission Data';
    $scope.commissionData = {};
    $scope.readOnly = true;
    $scope.requireCommissionPercent = true;
    $scope.manualBarsCharLimit = 10;
    $scope.commissionValueCharLimit = 10;
    $scope.crewBaseList = [];

    this.showToast = function(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    this.showErrors = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.getNameByIdInArray = function(id, array) {
      var match = lodash.findWhere(array, {
        id: id
      });
      if (match) {
        return match.name;
      }

      return '';
    };

    $scope.updateCommissionPercent = function() {
      var commissionPayableType = $this.getNameByIdInArray($scope.commissionData.commissionPayableTypeId, $scope.commissionPayableTypes);
      if (commissionPayableType === 'Retail item') {
        $scope.commissionPercentDisabled = true;
        $scope.commissionPercentRequired = false;
        $scope.commissionData.commissionPercentage = null;
        $scope.requireCommissionPercent = false;
      } else {
        $scope.commissionPercentDisabled = false;
        $scope.commissionPercentRequired = true;
        $scope.requireCommissionPercent = true;
      }
    };

    $scope.updateManualBars = function() {
      var manualBarsType = $this.getNameByIdInArray($scope.commissionData.manualBarsCommissionValueTypeId, $scope.discountTypes);
      if (manualBarsType === percentTypeName) {
        $scope.manualBarsCommissionUnit = percentTypeUnit;
        $scope.manualBarsCharLimit = 6;
      } else {
        $scope.manualBarsCommissionUnit = $scope.baseCurrency;
        $scope.manualBarsCharLimit = 11;
      }
    };

    $scope.updateIncentiveIncrement = function() {
      var commissionType = $this.getNameByIdInArray($scope.commissionData.commissionValueTypeId, $scope.discountTypes);
      if (commissionType === percentTypeName) {
        $scope.commissionValueUnit = percentTypeUnit;
        $scope.commissionValueCharLimit = 6;
      } else {
        $scope.commissionValueUnit = $scope.baseCurrency;
        $scope.commissionValueCharLimit = 11;
      }
    };

    this.createPayload = function() {
      var payload = angular.copy($scope.commissionData);
      payload.startDate = dateUtility.formatDateForAPI(payload.startDate);
      payload.endDate = dateUtility.formatDateForAPI(payload.endDate);
      if (!$scope.commissionPercentRequired) {
        payload.commissionPercentage = null;
      }

      return payload;
    };

    this.createSuccess = function() {
      $this.showToast('success', 'Create Commission Data', 'data successfully created');
      $this.hideLoadingModal();
      $location.path('commission-data-table');
    };

    this.createCommissionData = function(payload) {
      $this.showLoadingModal('creating commission data');
      commissionFactory.createCommissionData(payload).then($this.createSuccess, $this.showErrors);
    };

    this.editCommissionDataSuccess = function() {
      $this.showToast('success', 'Edit Commission Data', 'data successfully saved');
      $this.hideLoadingModal();
      $location.path('commission-data-table');
    };

    this.editCommissionData = function(payload) {
      $this.showLoadingModal('updating commission data');
      commissionFactory.updateCommissionData($routeParams.id, payload).then($this.editCommissionDataSuccess, $this.showErrors);
    };

    this.getCommissionDataSuccess = function(dataFromAPI) {
      var newData = angular.copy(dataFromAPI);
      newData.startDate = dateUtility.formatDateForApp(newData.startDate);
      newData.endDate = dateUtility.formatDateForApp(newData.endDate);
      newData.commissionPercentage = (newData.commissionPercentage) ? parseFloat(newData.commissionPercentage).toFixed(
        2) : null;
      newData.commissionValue = parseFloat(newData.commissionValue).toFixed(2);
      newData.discrepancyDeductionsCashPercentage = parseFloat(newData.discrepancyDeductionsCashPercentage).toFixed(
        2);
      newData.discrepancyDeductionsStockPercentage = parseFloat(newData.discrepancyDeductionsStockPercentage).toFixed(
        2);
      newData.manualBarsCommissionValue = parseFloat(newData.manualBarsCommissionValue).toFixed(2);

      $scope.commissionData = newData;
      $scope.updateManualBars();
      $scope.updateIncentiveIncrement();
      $scope.updateCommissionPercent();
      $this.hideLoadingModal();
    };

    this.getCommissionData = function() {
      $this.showLoadingModal('retrieving data');
      commissionFactory.getCommissionPayableData($routeParams.id).then($this.getCommissionDataSuccess, $this.showErrors);
    };

    $scope.saveData = function() {
      var payload = $this.createPayload();
      var initFunctionName = ($routeParams.state + 'CommissionData');
      if ($this[initFunctionName]) {
        $this[initFunctionName](payload);
      }
    };

    this.getCrewBaseList = function() {
      var uniqueCrewBaseTypes = {};
      employeesService.getEmployees(companyId).then(function(dataFromAPI) {
        angular.forEach(dataFromAPI.companyEmployees, function(employee) {
          if (!(employee.baseStationId in uniqueCrewBaseTypes)) {
            uniqueCrewBaseTypes[employee.baseStationId] = {};
            $scope.crewBaseList.push({
              id: employee.baseStationId,
              name: employee.stationCode
            });
          }
        });
      });
    };

    this.getCommissionPayableTypes = function() {
      commissionFactory.getCommissionPayableTypes().then(function(dataFromAPI) {
        $scope.commissionPayableTypes = angular.copy(dataFromAPI);
      });
    };

    this.getDiscountTypes = function() {
      commissionFactory.getDiscountTypes().then(function(dataFromAPI) {
        $scope.discountTypes = angular.copy(dataFromAPI);
      });
    };

    this.getCurrencyData = function(currencyId) {
      commissionFactory.getCurrency(currencyId).then(function(response) {
        if (response) {
          $scope.baseCurrency = angular.copy(response.currencyCode);
        }
      });
    };

    this.getCompanyData = function() {
      commissionFactory.getCompanyData(companyId).then(function(response) {
        if (response) {
          $this.getCurrencyData(angular.copy(response.baseCurrencyId));
        }
      });
    };

    this.setViewName = function() {
      var nameObject = {
        view: 'Viewing Commission Data',
        edit: 'Editing Commission Data',
        create: 'Creating Commission Data'
      };
      if (nameObject[$routeParams.state]) {
        $scope.viewName = nameObject[$routeParams.state];
      }
    };

    this.init = function() {
      $this.showLoadingModal();
      $scope.readOnly = $routeParams.state === 'view';
      var initPromises = [
        $this.setViewName(),
        $this.getCrewBaseList(),
        $this.getCommissionPayableTypes(),
        $this.getDiscountTypes(),
        $this.getCompanyData()
      ];
      $q.all(initPromises).then(function() {
        if ($routeParams.id) {
          $this.getCommissionData();
        }

        $this.hideLoadingModal();
      });
    };

    this.init();

  });
