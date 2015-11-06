'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDashboardCtrl
 * @description
 * # ReconciliationDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDashboardCtrl', function ($scope, dateUtility, reconciliationFactory) {

    $scope.viewName = 'Reconciliation Dashboard';
    $scope.search = {};

    $scope.toggleColumnView = function (columnName) {
      if (angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.updateOrderBy = function (orderName) {
      $scope.tableSortTitle = ($scope.tableSortTitle === orderName) ? ('-' + $scope.tableSortTitle) : (orderName);
    };

    $scope.doesInstanceContainAction = function (instance, actionName) {
      if (!instance.actions) {
        return false;
      }
      return instance.actions.indexOf(actionName) >= 0;
    };

    $scope.getSortingType = function (orderName) {
      if ($scope.tableSortTitle === orderName) {
        return 'ascending';
      } else if ($scope.tableSortTitle === '-' + orderName) {
        return 'descending';
      }
      return 'none';
    };

    $scope.getArrowIconAndClassForSorting = function (orderName) {
      var sortTypeToArrowTypeMap = {
        ascending: 'fa fa-sort-asc active',
        descending: 'fa fa-sort-desc active',
        none: 'fa fa-sort text-muted-light'
      };
      var sortType = $scope.getSortingType(orderName);
      return sortTypeToArrowTypeMap[sortType];
    };

    function getReconciliationList() {
      reconciliationFactory.getMockReconciliationDataList().then(function (dataFromAPI) {
        $scope.reconciliationList = angular.copy(dataFromAPI);
      });
    }

    function init() {
      $scope.tableSortTitle = 'dispatchedStation';
      $scope.displayColumns = {
        receivedStation: false,
        storeInstanceId: false,
        updatedDate: false,
        updatedBy: false
      };

      $scope.search = {
        scheduleStartDate: dateUtility.dateNumDaysBeforeTodayFormatted(10),
        scheduleEndDate: dateUtility.dateNumDaysBeforeTodayFormatted(2)
      };

      getReconciliationList();
    }

    init();

  });
