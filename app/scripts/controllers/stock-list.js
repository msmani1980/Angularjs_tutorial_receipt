'use strict';
/* global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:StockListCtrl
 * @description
 * # StockListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockListCtrl', function ($scope) {
    var _companyId = '403',
      _services = null;

    $scope.viewName = 'Stock Management';
    $scope.search = {};

  });
