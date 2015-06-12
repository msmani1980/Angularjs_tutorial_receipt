'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagEditCtrl
 * @description
 * @author kmeath
 * # CashBagCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagEditCtrl', function ($scope, cashBagService, $routeParams) {

    $scope.viewName = 'Cash Bag';
    $scope.readOnly = $routeParams.state !== 'edit';

    $scope.update = function (cashBag) {
      // var updatedCashBag = angular.copy(cashBag);
      // console.log(updatedCashBag);
      // call cashBagService.putCashBag

    };

    // if we have a route id param, get that model from the api
    cashBagService.getCashBag($routeParams.id).then(function (response) {
      $scope.cashBag = response;
      // console.log('response');
      // console.log(response);
    });
  });
