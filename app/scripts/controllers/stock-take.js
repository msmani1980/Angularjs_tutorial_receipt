'use strict';
/* global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:StockTakeCtrl
 * @description
 * # StockTakeCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StockTakeCtrl', function ($scope) {
    var _companyId = '403',
      _services = null;

    $scope.viewName = 'Stock Take';
    $scope.search = {};
        
  });
