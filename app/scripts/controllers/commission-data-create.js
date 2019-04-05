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
    $scope.commissionPercentRequired = true;

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
      $scope.errorCustom = [];
      $scope.displayError = false;
      var isDataValid = $this.validateNewData($scope.commissionData);
      if (!isDataValid) {
        $this.hideLoadingModal();
        $scope.displayError = true;
        return;
      }

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
      $scope.discountTypes = lodash.filter(angular.copy(dataFromAPI), function (type) {
        return type.id !== 3;
      });

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
      $scope.disableEditField = !canEdit || $scope.isViewOnly || $scope.readOnly;
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
      $scope.errorCustom = [];
      commissionFactory.getCompanyData(companyId).then($this.initializeDataFromAPI);
    };

    this.init();

    /*jshint maxcomplexity:8 */    
    this.validateNewData = function (record) {
      var isCrewBase = $this.validateNewDataField(record, 'crewBaseTypeId', 'Crew Base');
        
      var isSd = $this.validateNewDataField(record, 'startDate', 'Effective From');
      var isEd = $this.validateNewDataField(record, 'endDate', 'Effective To');
      var isValidDr = true;
      if (record !== null && isSd && isEd) {
        isValidDr = $this.validateStartAndEndDates(record);
      }

      var isPayTypeId = $this.validateNewDataField(record, 'commissionPayableTypeId', 'Commission Payable On');
      var isFieldValidateCommissionPercent = null;
      if (record.commissionPercentage === null && $scope.commissionPercentDisabled) {
        isFieldValidateCommissionPercent = true;
      } else {
        isFieldValidateCommissionPercent = $this.validatePercentField(record, 'commissionPercentage', 'Commission Percent');
      }

      var isManualTypeId = $this.validateNewDataField(record, 'manualBarsCommissionValueTypeId', 'Manual Bars Commission Type');
      var isFieldValidateManualCommissionPercent = true;
      if ($scope.commissionData.manualBarsCommissionValueTypeId === 1) {
        isFieldValidateManualCommissionPercent = $this.validatePercentField(record, 'manualBarsCommissionValue', 'Manual Bars Commisssion Value');
      } else {
        isFieldValidateManualCommissionPercent = $this.validateCurrencyField(record, 'manualBarsCommissionValue', 'Manual Bars Commisssion Value');
      }
      
      var isFieldValidateCashPercent = $this.validatePercentField(record, 'discrepancyDeductionsCashPercentage', 'Cash Percent');
      var isFieldValidateStockPercent = $this.validatePercentField(record, 'discrepancyDeductionsStockPercentage', 'Stock Percent');
      var isCommType = $this.validateNewDataField(record, 'commissionValueTypeId', 'Commission Type');
      var isFieldValidateCommissionVlaue = true;
      if ($scope.commissionData.commissionValueTypeId === 1) {
        isFieldValidateCommissionVlaue = $this.validatePercentField(record, 'commissionValue', 'Commisssion Value');
      } else {
        isFieldValidateCommissionVlaue = $this.validateCurrencyField(record, 'commissionValue', 'Commisssion Value');
      }
      
      var result = isCrewBase && isSd && isEd && isValidDr && isPayTypeId && isFieldValidateCommissionPercent &&
      isManualTypeId && isFieldValidateManualCommissionPercent && isFieldValidateCashPercent && isFieldValidateStockPercent &&
      isCommType && isFieldValidateCommissionVlaue;

      return result;
    };

    this.validateCurrencyField = function (record, fieldName, fieldValidationName) {
      var isValid = $this.validateNewDataField(record, fieldName, fieldValidationName);
      if (isValid) {
        var strValue =   angular.isString(record[fieldName]) ? record[fieldName] : record[fieldName].toString();
        isValid =  strValue.match(/^\d{0,6}(\.\d{0,2})?$/);
        if (!isValid) {
          $this.showValidationError(fieldValidationName, true, '');
        }
      }

      return isValid;
    };

    this.validatePercentField = function (record, fieldName, fieldValidationName) {
      var isValid = $this.validateNewDataField(record, fieldName, fieldValidationName);
      if (isValid) {
        var strValue =   angular.isString(record[fieldName]) ? record[fieldName] : record[fieldName].toString();
        isValid =  strValue.match(/^[-+]?([0-9]\d?(\.\d{1,3})?|0\.(\d?[1-9]|[1-9]\d))$|^100$|^100.00$/);
        if (!isValid) {
          $this.showValidationError(fieldValidationName, true, ', and should use percentage format 0-100');
        }
      }

      return isValid;
    };

    this.validateNewDataField = function (record, fieldName, fieldValidationName) {
      var result = true;

      if (record !== null && $scope.isFieldEmpty(record[fieldName])) {
        $this.showValidationError(fieldValidationName, false);
        result = false;
      }

      return result;
    };

    this.showValidationError = function (field, isPattern, isPatternValue) {
      var payload = { };

      if (isPattern) {
        payload = {
          field: field,
          value: 'field contains invalid characters' + isPatternValue
        };
      } else {
        payload = {
          field: field,
          value: 'is a required field. Please update and try again!'
        };
      }

      $scope.errorCustom.push(payload);
    };

    this.validateStartAndEndDates = function(record) {
      var isValid = true;
      if (!$scope.isFieldEmpty(record.startDate) && !$scope.isFieldEmpty(record.endDate) && $scope.isDateValueRangeInvalid(record)) {
        $scope.errorCustom.push({
          field: 'Start Date and End Date',
          value: 'End Date should be later than or equal to Start date.'
        });

        isValid = false;
      }

      return isValid; 
    };

    $scope.isDateValueRangeInvalid = function (record) {
      var isInValid = dateUtility.isAfterDatePicker(record.startDate, record.endDate);
      return isInValid;
    };

    $scope.isDateValueInvalid = function (value, record) {
      var isInValid = $scope.isFieldEmpty(value) || (record.startDate && record.endDate && dateUtility.isAfterDatePicker(record.startDate, record.endDate));
      return isInValid;
    };

    $scope.isFieldEmpty = function (value) {
      return (value === undefined || value === null || value.length === 0 || value === 'Invalid date');
    };

    $scope.isAmountInvalid = function (field) {
      var isInvalid = false; 
      if (angular.isDefined(field) && field !== null) {	
        var sField =   angular.isString(field) ? field : field.toString();
        isInvalid =  !field || !(sField.match(/^\d{0,6}(\.\d{0,2})?$/));
      }

      return isInvalid;
    };    

    $scope.isPercentInvalid = function (field) {
      var isInvalid = false; 
      if (angular.isDefined(field) && field !== null) {	
        var sField =   angular.isString(field) ? field : field.toString();
        isInvalid =  !field || !(sField.match(/^[-+]?([0-9]\d?(\.\d{1,3})?|0\.(\d?[1-9]|[1-9]\d))$|^100$|^100.00$/));
      }

      return isInvalid;
    };    

    $scope.isManualBarsCommisssionValueInvalid  = function () {
      var isInvalid = false;
      if ($scope.isFieldEmpty($scope.commissionData.manualBarsCommissionValueTypeId) || $scope.isFieldEmpty($scope.commissionData.manualBarsCommissionValue)) {
        return isInvalid;
      }

      if ($scope.commissionData.manualBarsCommissionValueTypeId === 1) {
        isInvalid = $scope.isPercentInvalid($scope.commissionData.manualBarsCommissionValue);
      } else {
        isInvalid = $scope.isAmountInvalid($scope.commissionData.manualBarsCommissionValue);
      }

      return isInvalid;
    };

    $scope.isCommisssionValueInvalid  = function () {
      var isInvalid = false;

      if ($scope.isFieldEmpty($scope.commissionData.commissionValueTypeId) || $scope.isFieldEmpty($scope.commissionData.commissionValue)) {
        return isInvalid;
      } 

      if ($scope.commissionData.commissionValueTypeId === 1) {
        isInvalid = $scope.isPercentInvalid($scope.commissionData.commissionValue);
      } else {
        isInvalid = $scope.isAmountInvalid($scope.commissionData.commissionValue);
      }

      return isInvalid;
    };

  });
