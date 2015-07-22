'use strict';
/*global moment*/

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionEditCtrl
 * @description
 * # EmployeeCommissionEditCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionEditCtrl', function ($scope, employeeCommissionFactory, dateUtility, ngToast, $location, $routeParams, $filter) {

    $scope.viewName = 'Employee Commission';
    $scope.commission = {
      startDate: moment().add(1, 'days').format('L').toString(),
      currenciesFields: {}
    };

    function showLoadingModal(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    $scope.isViewOnly = function () {
      return ($routeParams.state === 'view');
    };

    $scope.isCommissionReadOnly = function () {
      if (angular.isUndefined($scope.commission)) {
        return false;
      }

      if ($routeParams.state === 'create') {
        return false;
      }

      if ($routeParams.state === 'view') {
        return true;
      }

      return !dateUtility.isAfterToday($scope.commission.startDate);
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

    var datesWatcher = $scope.$watchGroup(['commission.startDate', 'commission.endDate'], function () {
      var payload = {};

      if (!angular.isUndefined($scope.commission.startDate)) {
        payload.startDate = dateUtility.formatDateForAPI($scope.commission.startDate);
      }

      if (!angular.isUndefined($scope.commission.endDate)) {
        payload.endDate = dateUtility.formatDateForAPI($scope.commission.endDate);
      }

      employeeCommissionFactory.getItemsList(payload, true).then(function (dataFromAPI) {
        $scope.itemList = dataFromAPI.masterItems;
      });

      var currencyFilters = angular.extend(payload, {
        isOperatedCurrency: true
      });

      employeeCommissionFactory.getCompanyCurrencies(currencyFilters).then(function (dataFromAPI) {
        $scope.companyCurrencies = dataFromAPI.response;
      });

      if ($scope.isCommissionReadOnly()) {
        datesWatcher();
      }

      if (shouldFetchCommission()) {
        employeeCommissionFactory.getCommission($routeParams.id).then(function (dataFromAPI) {
          $scope.commission = formatDatesForApp(angular.copy(dataFromAPI.employeeCommission));

          populateValuesFromAPI();
        });
      }
    });

    function shouldFetchCommission() {
      return $routeParams.state && $routeParams.id;
    }

    function getSelectedObjectFromArrayUsingId(fromArray, id) {
      var filteredObject = $filter('filter')(fromArray, {id: id}, function (expected, actual) {
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

      $scope.commission.currenciesFields = {};
      $scope.commission.selectedItem = getSelectedItemObject();
      $scope.commission.selectedPriceType = getSelectedPriceTypeObject();
      $scope.commission.selectedRateType = getSelectedRateTypeObject();

      angular.forEach($scope.commission.fixeds, function (currencyValue) {
        var currency = $filter('filter')($scope.companyCurrencies, {id: currencyValue.currencyId}, true)[0];
        $scope.commission.currenciesFields[currency.code] = currencyValue.fixedValue;
      });
    }

    employeeCommissionFactory.getPriceTypesList().then(function (dataFromAPI) {
      $scope.priceTypeList = angular.copy(dataFromAPI);
    });

    employeeCommissionFactory.getTaxRateTypes().then(function (dataFromAPI) {
      $scope.taxRateTypes = angular.copy(dataFromAPI);
    });

    function showToastMessage(className, type, message) {
      hideLoadingModal();
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function getRatePercentage() {
      return {
        percentage: $scope.commission.percentage
      };
    }

    function getRateAmount() {
      var currencies = [];
      angular.forEach($scope.companyCurrencies, function (currency) {
        var currencyValue = $scope.commission.currenciesFields[currency.code];
        currencies.push({
          fixedValue: currencyValue,
          currencyId: currency.id
        });
      });
      return {fixeds: currencies};
    }

    var getValuesFor = {
      'Percentage': getRatePercentage,
      'Amount': getRateAmount
    };

    function createPayload() {
      var rateValues = getValuesFor[$scope.commission.selectedRateType.taxRateType]();
      var payload = {
        startDate: dateUtility.formatDateForAPI($scope.commission.startDate),
        endDate: dateUtility.formatDateForAPI($scope.commission.endDate),
        itemMasterId: $scope.commission.selectedItem.id,
        types: [{priceTypeId: $scope.commission.selectedPriceType.id}]
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

    function requestErrorHandler() {
      showToastMessage('warning', 'Employee Commission', 'Error on API call');
    }

    $scope.submitForm = function () {
      if (!$scope.employeeCommissionForm.$valid && !$scope.isCommissionReadOnly()) {
        return false;
      }

      showLoadingModal('Saving');
      var payload = createPayload();
      var apiCall = $scope.commission.id ? 'updateCommission' : 'createCommission';
      employeeCommissionFactory[apiCall](payload).then(requestSuccessHandler, requestErrorHandler);
    };

  });
