'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagCreateCtrl
 * @description
 * @author kmeath
 * # CashBagCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagCreateCtrl', function ($scope, cashBagService, $routeParams, $location) {

    // make sure state is view, edit or create, otherwise redirect home
    if(-1===['view','edit','create'].indexOf($routeParams.state)){
      return $location.path('/');
    }

    $scope.viewName = 'Cash Bag';
    $scope.readOnly = $routeParams.state === 'view';
    $scope.state = $routeParams.state;

    // if we have a route id param, get that model from the api
    if($routeParams.id) {
      cashBagService.getCashBag($routeParams.id).then(function (response) {
        console.log(response);
        $scope.cashBag = response;
      });
    }
  });
