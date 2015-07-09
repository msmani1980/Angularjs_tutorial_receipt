'use strict';
/*global moment*/

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionListCtrl
 * @description
 * # EmployeeCommissionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionListCtrl', function ($scope, employeeCommissionFactory, dateUtility, ngToast) {
    $scope.viewName = 'Employee Commission';
    $scope.search = {
      startDate: '',
      endDate: '',
      itemList: [],
      priceTypesList: [],
      taxRateTypesList: []
    };

    function showToastMessage(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    $scope.clearForm = function () {
      delete $scope.search.selectedPriceType;
      delete $scope.search.selectedRateType;
      $scope.search.startDate = '';
      $scope.search.endDate = '';
    };

    employeeCommissionFactory.getPriceTypesList().then(function (dataFromAPI) {
      $scope.search.priceTypesList = dataFromAPI;
    });

    employeeCommissionFactory.getTaxRateTypes().then(function (dataFromAPI) {
      $scope.search.taxRateTypesList = dataFromAPI;
    });

  });
