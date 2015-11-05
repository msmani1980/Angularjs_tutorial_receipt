'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDashboardCtrl
 * @description
 * # ReconciliationDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDashboardCtrl', function ($scope, dateUtility) {

    $scope.viewName = 'Reconciliation Dashboard';
    $scope.search = {};
    $scope.multiSelectedValues = {};

    $scope.showCreatePopup = function () {
      angular.element('#reconciliationModal').modal('show');
    };

    $scope.status = {
      isopen: false
    };

    $scope.toggleColumnView = function (columnName) {
      if(angular.isDefined($scope.displayColumns[columnName])) {
        $scope.displayColumns[columnName] = !$scope.displayColumns[columnName];
      }
    };

    $scope.updateOrderBy = function (orderName) {
      var titleToSet = ($scope.tableSortTitle === orderName) ? ('-' + $scope.tableSortTitle) : (orderName);
      $scope.tableSortTitle = titleToSet;
    };

    $scope.getArrowType = function (orderName) {
      if ( $scope.tableSortTitle === orderName) {
        return 'ascending';
      } else if ( $scope.tableSortTitle === '-' + orderName) {
        return 'descending';
      }
      return 'none';
    };

    function initColumns () {
      $scope.displayColumns = {
        receivedStation: false,
        storeInstanceId: false,
        updatedDate: false,
        updatedBy: false
      }
    }

    function init() {
      $scope.tableSortTitle = 'dispatchedStation';
      initColumns();

      $scope.search = {
        scheduleStartDate: dateUtility.nowFormatted(),
        scheduleEndDate: dateUtility.nowFormatted()
      };

      $scope.reconciliationList = [
        {
          dispatchedStation: 'LGW',
          receivedStation: 'LTN',
          storeNumber: '7321',
          storeInstanceId: 91,
          scheduleDate: '10/08/2015',
          ePOSStatus: 'No',
          postTripStatus: '3/3',
          cashHandlerStatus: '4/4',
          ePOSCreatedStore: 'Yes',
          status: 'Inbounded',
          updatedDate: '9/10/2015 4:30',
          updatedBy: 'rabraham',
          actions: ['Validate', 'Report']
        },
        {
          dispatchedStation: 'LTN',
          receivedStation: 'LGW',
          storeNumber: '123',
          storeInstanceId: 54,
          scheduleDate: '12/08/2015',
          ePOSStatus: '3/3',
          postTripStatus: '2/3',
          cashHandlerStatus: '4/6',
          ePOSCreatedStore: 'No',
          status: 'Confirmed',
          updatedDate: '11/10/2015 4:30',
          updatedBy: 'rabraham',
          actions: ['Review', 'Pay Commission', 'Unconfirm', 'Report']

        },
        {
          dispatchedStation: 'STN',
          receivedStation: 'ORD',
          storeNumber: '7325',
          storeInstanceId: 103,
          scheduleDate: '11/21/2015',
          ePOSStatus: 'No',
          postTripStatus: '3/3',
          cashHandlerStatus: '4/4',
          ePOSCreatedStore: 'Yes',
          status: 'Discrepancies',
          updatedDate: '9/30/2015 4:30',
          updatedBy: 'tgunderson',
          actions: ['Review', 'Confirm', 'Report']
        },
        {
          dispatchedStation: 'LHR',
          receivedStation: 'GVA',
          storeNumber: '1132456',
          storeInstanceId: 91,
          scheduleDate: '08/10/2015',
          ePOSStatus: 'No',
          postTripStatus: '1/4',
          cashHandlerStatus: '4/5',
          ePOSCreatedStore: 'No',
          status: 'Commission Paid',
          updatedDate: '7/13/2015 4:30',
          updatedBy: 'tgunderson',
          actions: ['Report']
        }
      ];
    }
    init();

  });
