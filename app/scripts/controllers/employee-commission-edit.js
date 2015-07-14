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
  .controller('EmployeeCommissionEditCtrl', function ($scope, employeeCommissionFactory, dateUtility, ngToast, $location) {

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

    $scope.$watchGroup(['commission.startDate', 'commission.endDate'], function () {
      var payload = {};

      if (!angular.isUndefined($scope.commission.startDate)) {
        payload.startDate = dateUtility.formatDateForAPI($scope.commission.startDate);
      }

      if (!angular.isUndefined($scope.commission.endDate)) {
        payload.endDate = dateUtility.formatDateForAPI($scope.commission.endDate);
      }

      employeeCommissionFactory.getItemsList(payload, true).then(function (dataFromAPI) {
        $scope.itemsList = dataFromAPI.masterItems;
      });

      var currencyFilters = angular.extend(payload, {
        isOperatedCurrency: true
      });
      employeeCommissionFactory.getCompanyCurrencies(currencyFilters).then(function (dataFromAPI) {
        $scope.companyCurrencies = dataFromAPI.response;
      });
    });

    employeeCommissionFactory.getPriceTypesList().then(function (dataFromAPI) {
      $scope.priceTypesList = dataFromAPI;
    });

    employeeCommissionFactory.getTaxRateTypes().then(function (dataFromAPI) {
      $scope.taxRateTypes = dataFromAPI;
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
      if (!$scope.employeeCommissionForm.$valid) {
        return false;
      }

      showLoadingModal('Saving');
      var payload = createPayload();
      employeeCommissionFactory.createCommission(payload).then(requestSuccessHandler, requestErrorHandler);
    };

  })
;
