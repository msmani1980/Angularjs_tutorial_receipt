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
  .controller('EmployeeCommissionEditCtrl', function ($scope, employeeCommissionFactory, dateUtility, ngToast) {

    $scope.viewName = 'Employee Commission';
    $scope.commission = {
      startDate: moment().add(1, 'days').format('L').toString(),
      currenciesFields: {}
    };

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
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function createPayload() {
      var payload = {
        employeeCommission: {
          startDate: dateUtility.formatDateForAPI($scope.commission.startDate),
          endDate: dateUtility.formatDateForAPI($scope.commission.endDate),
          itemMasterId: $scope.commission.selectedItem.id,
          types: [{priceTypeId: $scope.commission.selectedPriceType.id}]
          //percentage: $scope.currenciesFields.percentage
          //commission.selectedRateType
        }
      };
      return payload;
    }

    function createRequestSuccessHandler(dataFromAPI) {
      showToastMessage('success', 'Employee Commission', dataFromAPI);
    }

    function createRequestErrorHandler(dataFromAPI) {
      showToastMessage('warning', 'Employee Commission', dataFromAPI);
    }

    $scope.submitForm = function () {
      if (!$scope.employeeCommissionForm.$valid) {
        return false;
      }

      var payload = createPayload();
      employeeCommissionFactory.createCommission(payload).then(createRequestSuccessHandler, createRequestErrorHandler);
    };

  });
