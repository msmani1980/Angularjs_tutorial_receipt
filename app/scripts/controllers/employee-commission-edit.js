'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionEditCtrl
 * @description
 * # EmployeeCommissionEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionEditCtrl', function($scope, employeeCommissionFactory, dateUtility, messageService,
    $location, $routeParams, $filter) {

    $scope.viewName = 'Employee Commission';

    angular.element('.retail-name-multiple-select').select2();

    $scope.startDate = dateUtility.tomorrowFormattedDatePicker();

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
      if ($scope.commission.types.length === 0) {
        return {};
      }

      var priceId = $scope.commission.types[0].priceTypeId;
      return getSelectedObjectFromArrayUsingId($scope.priceTypeList, priceId);
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
        $scope.commission.currenciesFields[currency.code] = formatAsCurrency(currencyValue.fixedValue, 2);
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
        types: [{
          priceTypeId: $scope.commission.selectedPriceType.id
        }]
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
      if (!$scope.employeeCommissionForm.$valid && !$scope.isCommissionReadOnly()) {
        return false;
      }

      showLoadingModal('Saving');
      var payload = createPayload();
      var apiCall = $scope.commission.id ? 'updateCommission' : 'createCommission';
      employeeCommissionFactory[apiCall](payload).then(requestSuccessHandler, requestErrorHandler);
    };
    
    $scope.isCurrentEffectiveDate = function (date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && (dateUtility.isAfterTodayDatePicker(date.endDate) || dateUtility.isTodayDatePicker(date.endDate)));
    };
  });
