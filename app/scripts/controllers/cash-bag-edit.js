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
  .controller('CashBagEditCtrl', function ($scope, $routeParams, $q, ngToast, cashBagFactory) {

    var companyId = cashBagFactory.getCompanyId();

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
      cashBagFactory.updateCashBag($routeParams.id, payload).then(
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

    var getCashBag = cashBagFactory.getCashBag($routeParams.id).then(
      function (response) {
        $scope.cashBag = response;
        $scope.displayError = false;
        $scope.formErrors = {};
      },
      showErrors
    );

    var getCompany = cashBagFactory.getCompany(companyId).then(
      function (response) {
        $scope.company = response;
      }
    );

    var getCompanyCurrencies = cashBagFactory.getCompanyCurrencies().then(
      function(response) {
        $scope.companyCurrencies = response.response;
      }
    );

    function getCurrencyCode(currencies, currencyId){
      angular.forEach(currencies, function (currency) {
          if (currencyId == currency.id) {
            return currency.code;
          }
        }
      );
    }

    $q.all([getCashBag, getCompany, getCompanyCurrencies]).then(function(){
      $scope.getCurrencyCode = function(currencyId) {
        var returnValue = getCurrencyCode($scope.companyCurrencies, currencyId);
        // TODO, does not work
        // console.log(returnValue);
        return returnValue;
      }
    });

  });
