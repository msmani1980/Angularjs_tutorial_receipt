'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionEditCtrl
 * @description
 * # EmployeeCommissionEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionEditCtrl', function($scope, employeeCommissionFactory, dateUtility, messageService, $location, $routeParams, $filter) {

    var $this = this;
    $scope.viewName = 'Employee Commission';
    angular.element('.retail-name-multiple-select').select2();
    $scope.startDate = dateUtility.tomorrowFormattedDatePicker();
    $scope.errorCustom = [];
    
    $scope.commission = {
      startDate: angular.copy($scope.startDate),
      currenciesFields: {}
    };

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
      angular.element('.modal-backdrop').remove();
    }

    $scope.isViewOnly = function() {
      return ($routeParams.state === 'view');
    };
    
    $scope.isCreate = function() {
      return ($routeParams.state === 'create');
    };
    
    $scope.isEdit = function() {
      return ($routeParams.state === 'edit');
    };

    /*jshint maxcomplexity:6*/
    $scope.isCommissionReadOnly = function() {
      if (angular.isUndefined($scope.commission)) {
        return false;
      }

      if ($routeParams.state === 'create' || (angular.isUndefined($scope.commission))) {
        return false;
      }

      if ($routeParams.state === 'view') {
        return true;
      }

      if ($scope.isFieldEmpty($scope.commission.startDate) && $routeParams.state === 'edit') {
        return false;
      }

      return !dateUtility.isAfterTodayDatePicker($scope.commission.startDate);
    };

    function formatDatesForApp(commissionObject) {
      if (commissionObject.startDate) {
        commissionObject.startDate = dateUtility.formatDateForApp(commissionObject.startDate);
      }

      if (commissionObject.endDate) {
        commissionObject.endDate = dateUtility.formatDateForApp(commissionObject.endDate);
      }

      return commissionObject;
    }

    function shouldFetchCommission() {
      return ($routeParams.state && $routeParams.id) && !$scope.commission.selectedItem;
    }

    function getSelectedObjectFromArrayUsingId(fromArray, id) {
      var filteredObject = $filter('filter')(fromArray, {
        id: id
      }, function(expected, actual) {
        return angular.equals(parseInt(expected), parseInt(actual));
      });

      if (filteredObject && filteredObject.length > 0) {
        return filteredObject[0];
      }

      return {};
    }

    function getSelectedItemObject() {
      var itemId = $scope.commission.itemMasterId;
      return getSelectedObjectFromArrayUsingId($scope.itemList, itemId);
    }

    function getSelectedPriceTypeObject() {
      if ($scope.commission.priceTypeId === undefined) {
        return {};
      }

      return getSelectedObjectFromArrayUsingId($scope.priceTypeList, $scope.commission.priceTypeId);
    }

    function getSelectedRateTypeObject() {
      var rateTypeId = $scope.commission.fixeds.length > 0 ? 1 : 2;
      return getSelectedObjectFromArrayUsingId($scope.taxRateTypes, rateTypeId);
    }

    function populateValuesFromAPI() {
      hideLoadingModal();
      $scope.commission.currenciesFields = {};
      $scope.commission.selectedItem = getSelectedItemObject();
      $scope.commission.selectedPriceType = getSelectedPriceTypeObject();
      $scope.commission.selectedRateType = getSelectedRateTypeObject();

      angular.forEach($scope.commission.fixeds, function(currencyValue) {
        var currency = $filter('filter')($scope.companyCurrencies, {
          id: currencyValue.currencyId
        }, true)[0];
        $scope.commission.currenciesFields[currency.code] = currencyValue.fixedValue.toFixed(2);
      });
    }

    function fetchEmployeeCommissionFromAPI() {
      if (shouldFetchCommission()) {
        showLoadingModal('Loading Employee Commission');
        employeeCommissionFactory.getCommission($routeParams.id).then(function(dataFromAPI) {
          $scope.commission = formatDatesForApp(angular.copy(dataFromAPI.employeeCommission));

          populateValuesFromAPI();
        });
      }
    }

    var datesWatcher = $scope.$watchGroup(['commission.startDate', 'commission.endDate'], function() {
      var payload = {};
      
      if (!angular.isUndefined($scope.commission.startDate)) {
        payload.startDate = dateUtility.formatDateForAPI($scope.commission.startDate);
      }

      if (!angular.isUndefined($scope.commission.endDate)) {
        payload.endDate = dateUtility.formatDateForAPI($scope.commission.endDate);
      }

      employeeCommissionFactory.getItemsList(payload, true).then(function(dataFromAPI) {
        $scope.itemList = dataFromAPI.masterItems;
        fetchEmployeeCommissionFromAPI();
      });

      var currencyFilters = angular.extend(payload, {
        isOperatedCurrency: true
      });

      employeeCommissionFactory.getCompanyCurrencies(currencyFilters).then(function(dataFromAPI) {
        $scope.companyCurrencies = dataFromAPI.response;
      });

      if ($scope.isCommissionReadOnly()) {
        datesWatcher();
      }

    });

    employeeCommissionFactory.getPriceTypesList().then(function(dataFromAPI) {
      $scope.priceTypeList = angular.copy(dataFromAPI);
    });

    employeeCommissionFactory.getTaxRateTypes().then(function(dataFromAPI) {
      $scope.taxRateTypes = angular.copy(dataFromAPI);
    });

    function showToastMessage(className, type, message) {
      hideLoadingModal();
      messageService.display(className, '<strong>' + type + '</strong>: ' + message);
    }

    function getRatePercentage() {
      return {
        percentage: $scope.commission.percentage
      };
    }

    function getRateAmount() {
      var currencies = [];
      angular.forEach($scope.companyCurrencies, function(currency) {
        var currencyValue = $scope.commission.currenciesFields[currency.code];
        currencies.push({
          fixedValue: currencyValue,
          currencyId: currency.id
        });
      });

      return {
        fixeds: currencies
      };
    }

    var getValuesFor = {
      Percentage: getRatePercentage,
      Amount: getRateAmount
    };

    function createPayload() {
      var rateValues = getValuesFor[$scope.commission.selectedRateType.taxRateType]();
      var payload = {
        startDate: dateUtility.formatDateForAPI($scope.commission.startDate),
        endDate: dateUtility.formatDateForAPI($scope.commission.endDate),
        itemMasterId: $scope.commission.selectedItem.id,
        priceTypeId: $scope.commission.selectedPriceType.id
      };

      if ($scope.commission.id) {
        payload.id = $scope.commission.id;
      }

      return {
        employeeCommission: angular.extend(payload, rateValues)
      };
    }

    function requestSuccessHandler() {
      showToastMessage('success', 'Employee Commission', 'successfully created!');
      $location.path('/employee-commission-list');
    }

    function requestErrorHandler(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }

    $scope.submitForm = function() {
      $scope.errorCustom = [];
      var isDataValid = $this.validateNewData($scope.commission);
      if (!isDataValid) {
        hideLoadingModal();
        $scope.displayError = true;  
        return;
      }

      var isFormValid = validateForm();
      if (!isFormValid) {
        hideLoadingModal();
        return;
      }

      if (!$scope.employeeCommissionForm.$valid && !$scope.isCommissionReadOnly()) {
        return false;
      }

      showLoadingModal('Saving');
      var payload = createPayload();
      var apiCall = $scope.commission.id ? 'updateCommission' : 'createCommission';
      employeeCommissionFactory[apiCall](payload).then(requestSuccessHandler, requestErrorHandler);
    };

    function validateForm () {
      $scope.displayError = !$scope.employeeCommissionForm.$valid;
      return $scope.employeeCommissionForm.$valid;
    }

    this.validateNewDataField = function (record, fieldName, fieldValidationName) {
      var result = true;

      if (record !== null && $scope.isFieldEmpty(record[fieldName])) {
        $this.showValidationError(fieldValidationName, false);
        result = false;
      }

      return result;
    };

    this.showValidationError = function (field, isPattern) {
      var payload = { };

      if (isPattern) {
        payload = {
          field: field,
          value: 'field contains invalid characters'
        };
      } else {
        payload = {
          field: field,
          value: 'is a required field. Please update and try again!'
        };
      }

      $scope.errorCustom.push(payload);
    };

    /*jshint maxcomplexity:8 */    
    this.validateNewData = function (record) {
      var validateItem = $this.validateNewDataField(record, 'selectedItem', 'Item Name');
      var validatePriceType = $this.validateNewDataField(record, 'selectedPriceType', 'Sale Type');
      var validateRateType = $this.validateNewDataField(record, 'selectedRateType', 'Rate Type');
      var isFieldValidatePriceAmount = true;
      var isFieldValidatePricePercent = true;

      if (validateRateType) {
        var rateTypeValue =  record.selectedRateType;
        if (rateTypeValue && rateTypeValue.taxRateType === 'Amount') {

          angular.forEach($scope.companyCurrencies, function(currency) {
            var fieldName = currency.code;
            var isFieldValidateOneCurr = $this.validateNewDataField(record.currenciesFields, fieldName, 'Rate for Currency [' + currency.code + ']');
            if (isFieldValidateOneCurr) {
              var sAmount = angular.isString(record.currenciesFields[fieldName]) ? record.currenciesFields[fieldName] : record.currenciesFields[fieldName].toString();
              isFieldValidateOneCurr =  sAmount.match(/^\d{0,6}(\.\d{0,2})?$/);
              if (!isFieldValidateOneCurr) {
                $this.showValidationError('Rate for Currency [' + currency.code + ']', true);
              }
            }

            if (!isFieldValidateOneCurr) {
              isFieldValidatePriceAmount = false;
            }

          });
        }

        if (rateTypeValue && rateTypeValue.taxRateType === 'Percentage') {
          isFieldValidatePricePercent = $this.validateNewDataField(record, 'percentage', 'Percentage');
          if (isFieldValidatePricePercent) {
            var sPercentage =   angular.isString(record.percentage) ? record.percentage : record.percentage.toString();
            isFieldValidatePricePercent =  sPercentage.match(/^\d{0,6}(\.\d{0,2})?$/);
            if (!isFieldValidatePricePercent) {
              $this.showValidationError('Percentage', true);
            }
          }
        }
      }

      var validateSd = $this.validateNewDataField(record, 'startDate', 'Start Date');
      var validateEd = $this.validateNewDataField(record, 'endDate', 'End Date');
      var isValidDr = true;
      if (record !== null && validateSd && validateEd) {
        isValidDr = $this.validateStartAndEndDates(record);
      }

      return validateItem && validatePriceType && validateRateType && isFieldValidatePriceAmount && isFieldValidatePricePercent && validateSd && validateEd && isValidDr;
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

    $scope.isCurrentEffectiveDate = function (date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && (dateUtility.isAfterTodayDatePicker(date.endDate) || dateUtility.isTodayDatePicker(date.endDate)));
    };

    $scope.isFieldEmpty = function (value) {
      return (value === undefined || value === null || value.length === 0 || value === 'Invalid date');
    };

    $scope.isDateValueInvalid = function (value, record) {
      var isInValid = $scope.isFieldEmpty(value) || (record.startDate && record.endDate && dateUtility.isAfterDatePicker(record.startDate, record.endDate));
      return isInValid;
    };

    $scope.isValueInvalid = function (field) {
      var isInvalid = false; 
      if (field !== null) {	
        var sField =   angular.isString(field) ? field : field.toString();
        isInvalid =  !field || !(sField.match(/^\d{0,6}(\.\d{0,2})?$/));
      }

      return isInvalid;
    };    
  });
