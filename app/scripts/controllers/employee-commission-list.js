'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionListCtrl
 * @description
 * # EmployeeCommissionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionListCtrl', function ($scope, employeeCommissionFactory, dateUtility, ngToast, $location) {
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

    $scope.showCommission = function (commission) {
      $location.path('employee-commission/view/' + commission.id);
    };

    $scope.editCommission = function (commission) {
      $location.path('employee-commission/edit/' + commission.id);
    };

    $scope.isCommissionReadOnly = function(commission) {
      if (angular.isUndefined(commission)) {
        return false;
      }
      return !dateUtility.isAfterToday(commission.startDate);
    };

    $scope.isCommissionEditable = function(commission) {
      if (angular.isUndefined(commission)) {
        return false;
      }
      return dateUtility.isAfterToday(commission.endDate);
    };

    function showToastMessage(className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    }

    function showErrors(dataFromAPI) {
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      $scope.displayError = true;
      showToastMessage('warning','Employee Commission', 'error deleting commission!');

    }

    function successDeleteHandler() {
      showToastMessage('success','Employee Commission', 'successfully deleted commission!');
    }

    $scope.deleteCommission = function () {
      angular.element('.delete-warning-modal').modal('hide');
      employeeCommissionFactory.deleteCommission($scope.commissionToDelete.id).then(successDeleteHandler, showErrors);
    };

    $scope.showDeleteConfirmation = function (commissionToDelete) {
      $scope.commissionToDelete = commissionToDelete;
      angular.element('.delete-warning-modal').modal('show');
    };

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
