'use strict';
/*global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:CashBagEditCtrl
 * @description
 * @author kmeath
 * # CashBagCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagEditCtrl', function ($scope, $routeParams, ngToast, ENV, cashBagService, companiesService) {

    $scope.viewName = 'Cash Bag';
    $scope.readOnly = $routeParams.state !== 'edit';
    $scope.displayError = false;

    $scope.update = function (updatedCashBag) {
      var saveCashBag = angular.copy(updatedCashBag);
      // TODO see how Luis is doing this in company-relationship-service, tsv154 branch
      saveCashBag.scheduleDate = moment(saveCashBag.scheduleDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
      $scope.cashBag.scheduleDate = saveCashBag.scheduleDate;
      var payload = {
        cashBag: saveCashBag
      };
      cashBagService.updateCashBag($routeParams.id, payload).then(
        function () {
          ngToast.create({
            className: 'success',
            dismissButton: true,
            content: '<strong>Cash bag</strong>: successfully updated!'
          });
          $scope.displayError = false;
          $scope.formErrors = {};
        },
        showErrors
      );

    };

    function showErrors(error) {
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Cash bag</strong>: error!'
      });
      $scope.displayError = true;
      $scope.formErrors = error.data;
    }

    // if we have a route id param, get that model from the api
    cashBagService.getCashBag($routeParams.id).then(
      function (response) {
        $scope.cashBag = response;
        $scope.displayError = false;
        $scope.formErrors = {};
      },
      showErrors
    );
    // console.log(ENV);
    // companiesService.getCompany()
  });
