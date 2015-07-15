'use strict';

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
      itemsList: [],
      priceTypesList: [],
      taxRateTypesList: []
    };

    $scope.$watchGroup(['search.startDate', 'search.endDate'], function () {
      var payload = {};

      if (angular.isDefined($scope.search.startDate) && dateUtility.isDateValidForApp($scope.search.startDate)) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
      }

      if (angular.isDefined($scope.search.endDate) && dateUtility.isDateValidForApp($scope.search.endDate)) {
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }

      if (payload.startDate && payload.endDate) {
        employeeCommissionFactory.getItemsList(payload).then(function (dataFromAPI) {
          $scope.search.itemsList = dataFromAPI.retailItems;
        });
      }
    });

    function formatDatesForApp(commissionListData) {
      commissionListData.forEach(function (commissionObject) {
        if (commissionObject.startDate) {
          commissionObject.startDate = dateUtility.formatDateForApp(commissionObject.startDate);
        }

        if (commissionObject.endDate) {
          commissionObject.endDate = dateUtility.formatDateForApp(commissionObject.endDate);
        }
      });
      return commissionListData;
    }

    function setRateAndSaleTypes(commissionListData) {
      //commissionListData.forEach(function (commissionObject) {
        //TODO: wait on API fix to transform data here
      //});
      return commissionListData;
    }

    function prepareDataForTable(dataFromAPI) {
      var transformedData = formatDatesForApp(angular.copy(dataFromAPI));
      return setRateAndSaleTypes(transformedData);
    }

    function showToastMessage(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    $scope.searchCommissions = function () {
      showToastMessage('warning', 'Employee Commission', 'API not ready');
    };

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

    employeeCommissionFactory.getCommissionList().then(function (dataFromAPI) {
      $scope.commissionList = prepareDataForTable(dataFromAPI.employeeCommissions);
    });

  });
