'use strict';
/*global moment*/
/*global $*/


/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataTableCtrl
 * @description
 * # CommissionDataTableCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataTableCtrl', function ($scope) {
    $scope.viewName = 'Commission Data Table';

    $scope.commissionData = [{
      crewBase: 'CREW',
      startDate: '08/20/2015',
      endDate: '09/20/2015',
      product: false,
      eposSales: true,
      eposPercent: 1.00,
      cashBanked: false,
      cashBankedPercent: 0.00,
      manualBars: 10.00,
      cash: 20.00,
      stock: 5.00,
      incentiveIncrement: 12.00
    }, {
      crewBase: 'CREW',
      startDate: '08/20/2015',
      endDate: '09/20/2015',
      product: true,
      eposSales: false,
      eposPercent: 0.00,
      cashBanked: false,
      cashBankedPercent: 0.00,
      manualBars: 100.00,
      cash: 20.00,
      stock: 5.00,
      incentiveIncrement: 12.00
    }, {
      crewBase: 'CREW',
      startDate: '08/20/2015',
      endDate: '09/20/2015',
      product: false,
      eposSales: false,
      eposPercent: 0.00,
      cashBanked: true,
      cashBankedPercent: 2.00,
      manualBars: 15.00,
      cash: 20.00,
      stock: 5.00,
      incentiveIncrement: 12.00
    }];

    $scope.searchCommissionData = function () {

    };

    $scope.canDelete = function (data) {
      return true;
    };


  });
