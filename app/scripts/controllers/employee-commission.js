'use strict';
/*global moment*/

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionCtrl
 * @description
 * # EmployeeCommissionCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionCtrl', function ($scope, employeeCommissionFactory, dateUtility, ngToast) {

    $scope.viewName = 'Employee Commission';
    $scope.startDate = moment().add(1, 'days').format('L').toString();

    $scope.$watchGroup(['startDate', 'endDate'], function () {
      var payload = {};

      if (!angular.isUndefined($scope.startDate)) {
        payload.startDate = dateUtility.formatDateForAPI($scope.startDate);
      }

      if (!angular.isUndefined($scope.endDate)) {
        payload.endDate = dateUtility.formatDateForAPI($scope.endDate);
      }

      employeeCommissionFactory.getItemsList(payload).then(function (dataFromAPI) {
        $scope.itemsList = dataFromAPI.retailItems;
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

    function showToastMessage(message) {
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Cash bag</strong>: ' + message
      });
    }

    $scope.submitForm = function() {
      showToastMessage('API not ready yet');
    };

  });
