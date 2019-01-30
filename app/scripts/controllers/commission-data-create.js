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
  .controller('CommissionDataCtrl', function($scope, $routeParams, commissionFactory, dateUtility, lodash,
    messageService, $location, employeesService, globalMenuService, $q) {

    var $this = this;
    var percentTypeName = 'Percentage';
    var percentTypeUnit = '%';

    $scope.viewName = 'Creating Commission Data';
    $scope.commissionData = {};
    $scope.readOnly = true;
    $scope.requireCommissionPercent = true;
    $scope.manualBarsCharLimit = 10;
    $scope.commissionValueCharLimit = 10;
    $scope.crewBaseList = [];
    $scope.minDate = dateUtility.dateNumDaysAfterTodayFormattedDatePicker(1);

    this.showToast = function(className, type, message) {
      messageService.display(className, message, type);
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
      var sDate = angular.copy(dateUtility.formatDateForApp(newData.startDate));
      var eDate = angular.copy(dateUtility.formatDateForApp(newData.endDate));

      $scope.commissionData.startDate = sDate.toString();
      $scope.commissionData.endDate = eDate.toString();
      $scope.commissionData.commissionPercentage = (newData.commissionPercentage) ? parseFloat(newData.commissionPercentage).toFixed(2) : null;
      $scope.commissionData.commissionValue = parseFloat(newData.commissionValue).toFixed(2);
      $scope.commissionData.discrepancyDeductionsCashPercentage = parseFloat(newData.discrepancyDeductionsCashPercentage).toFixed(2);
      $scope.commissionData.discrepancyDeductionsStockPercentage = parseFloat(newData.discrepancyDeductionsStockPercentage).toFixed(2);
      $scope.commissionData.manualBarsCommissionValue = parseFloat(newData.manualBarsCommissionValue).toFixed(2);
      $scope.commissionData.commissionPayableTypeId = newData.commissionPayableTypeId;
      $scope.commissionData.manualBarsCommissionValueTypeId = newData.manualBarsCommissionValueTypeId;
      $scope.commissionData.commissionValueTypeId = newData.commissionValueTypeId;
      $scope.commissionData.crewBaseTypeId = newData.crewBaseTypeId;

      $scope.updateManualBars();
      $scope.updateIncentiveIncrement();
      $scope.updateCommissionPercent();
      $this.hideLoadingModal();
      $this.setViewVariables();
    };

    this.getCommissionData = function() {
      $this.showLoadingModal('retrieving data');
      commissionFactory.getCommissionPayableData($routeParams.id).then($this.getCommissionDataSuccess, $this.showErrors);
    };

    $scope.saveData = function() {
      var isFormValid = validateForm();
      if (!isFormValid) {
        $this.hideLoadingModal();
        return;
      }

      var payload = $this.createPayload();
      var initFunctionName = ($routeParams.state + 'CommissionData');
      if ($this[initFunctionName]) {
        $this[initFunctionName](payload);
      }
    };

    function validateForm () {
      $scope.displayError = !$scope.commissionDataForm.$valid;
      return $scope.commissionDataForm.$valid;
    }

    this.getCrewBaseListSuccess = function(dataFromAPI) {
      angular.forEach(dataFromAPI.response, function(baseStation) {
        $scope.crewBaseList.push({
          id: baseStation.stationId,
          name: baseStation.code
        });
      });
    };

    this.getCrewBaseList = function() {
      var companyId = globalMenuService.company.get();
      return employeesService.getBaseStations(companyId);
    };

    this.getCommissionPayableTypesSuccess = function(dataFromAPI) {
      $scope.commissionPayableTypes = angular.copy(dataFromAPI);
    };

    this.getCommissionPayableTypes = function() {
      return commissionFactory.getCommissionPayableTypes();
    };

    this.getDiscountTypesSuccess = function(dataFromAPI) {
      $scope.discountTypes = angular.copy(dataFromAPI);
    };

    this.getDiscountTypes = function() {
      return commissionFactory.getDiscountTypes();
    };

    this.getCurrencyDataSuccess = function(dataFromAPI) {
      $scope.baseCurrency = angular.copy(dataFromAPI.currencyCode);
    };

    this.getCurrencyData = function(currencyId) {
      return commissionFactory.getCurrency(currencyId);
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

    this.completeInitializeAfterDependencies = function(responseCollection) {
      $this.getCrewBaseListSuccess(responseCollection[0]);
      $this.getCommissionPayableTypesSuccess(responseCollection[1]);
      $this.getDiscountTypesSuccess(responseCollection[2]);
      if (responseCollection[3]) {
        $this.getCurrencyDataSuccess(responseCollection[3]);
      }

      if ($routeParams.id) {
        $this.getCommissionData();
      }

      $this.hideLoadingModal();

    };

    this.setViewVariables = function () {
      var canEdit = false;

      if ($routeParams.state === 'edit' && $scope.commissionData) {
        var isInFuture = dateUtility.isAfterTodayDatePicker($scope.commissionData.startDate) && dateUtility.isAfterTodayDatePicker($scope.commissionData.endDate);
        var isInPast = dateUtility.isYesterdayOrEarlierDatePicker($scope.commissionData.endDate);
        if (isInPast) {
          $scope.readOnly = true; 
        }

        canEdit = isInFuture;
        $scope.isViewOnly = isInPast;
      } else {
        $scope.isViewOnly = $routeParams.state === 'view';
        canEdit = $routeParams.state === 'create';
      }

      $scope.displayError = false;
      $scope.disableEditField = !canEdit || $scope.isViewOnly;
    };

    this.initializeDataFromAPI = function(companyDataFromAPI) {
      var initPromises = [
        $this.getCrewBaseList(),
        $this.getCommissionPayableTypes(),
        $this.getDiscountTypes()
      ];
      if (companyDataFromAPI) {
        initPromises.push($this.getCurrencyData(angular.copy(companyDataFromAPI.baseCurrencyId)));
      }

      $q.all(initPromises).then($this.completeInitializeAfterDependencies);
    };

    this.init = function() {
      var companyId = globalMenuService.company.get();
      $scope.disableEditField = false;
      $this.showLoadingModal();
      $this.setViewName();
      $scope.readOnly = ($routeParams.state === 'view');
      commissionFactory.getCompanyData(companyId).then($this.initializeDataFromAPI);
    };

    this.init();

  });
