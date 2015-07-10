'use strict';
/* global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:StockDashboardCtrl
 * @description
 * # StockDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockDashboardCtrl', function ($scope) {
    var _companyId = '403',
      _services = null;

    $scope.viewName = 'Stock Dashboard';
    $scope.search = {};

  });
