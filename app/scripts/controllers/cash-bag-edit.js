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
  .controller('CashBagEditCtrl', function ($scope, cashBagService, $routeParams, ngToast) {

    $scope.viewName = 'Cash Bag';
    $scope.readOnly = $routeParams.state !== 'edit';
    $scope.displayError = false;

    $scope.update = function (cashBag) {
      var payload = {
        cashBag: angular.copy(cashBag)
      };
      cashBagService.updateCashBag($routeParams.id, payload).then(
        function () {
          ngToast.create({
            className: 'success',
            dismissButton: true,
            content: '<strong>Cash bag</strong>: successfully updated!'
          });
        },
        function (error) {
          ngToast.create({
            className: 'warning',
            dismissButton: true,
            content: '<strong>Cash bag</strong>: error updating menu!'
          });
          $scope.displayError = true;
          $scope.formErrors = error.data;
        }
      );

    };

    // if we have a route id param, get that model from the api
    cashBagService.getCashBag($routeParams.id).then(function (response) {
      $scope.cashBag = response;
    });
  });
