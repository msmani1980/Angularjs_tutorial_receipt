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
    $scope.readOnly = $routeParams.state === 'view';
    $scope.displayError = false;
    $scope.scheduleDate = $routeParams.scheduleDate;
    $scope.scheduleNumber = $routeParams.scheduleNumber;

    $scope.update = function (updatedCashBag) {


    };

    $scope.save = function(formCashBag) {
      switch ($routeParams.state) {
        case 'edit':
          var saveCashBag = angular.copy(formCashBag);
          // TODO see how Luis is doing this in company-relationship-service, tsv154 branch
          saveCashBag.scheduleDate = moment(saveCashBag.scheduleDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
          $scope.cashBag.scheduleDate = saveCashBag.scheduleDate;
          var payload = {
            cashBag: saveCashBag
          };
          cashBagFactory.updateCashBag($routeParams.id, payload).then(updateSuccess, showErrors);
          break;
        case 'create':
          cashBagFactory.createCashBag({cashBag: formCashBag}).then(function(){
            alert('successs');
          }, showErrors);
          break;
      }
    };

    function updateSuccess() {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Cash bag</strong>: successfully updated!'
      });
      $scope.displayError = false;
      $scope.formErrors = {};
    }

    function showErrors(error) {
      ngToast.create({
        className: 'warning',
        dismissButton: true,
        content: '<strong>Cash bag</strong>: error!'
      });
      $scope.displayError = true;
      $scope.formErrors = error.data;
    }

    var getCompany = cashBagFactory.getCompany(companyId).then(
      function (response) {
        $scope.company = response;
      }
    );

    var getCompanyCurrencies = cashBagFactory.getCompanyCurrencies().then(
      function (response) {
        $scope.companyCurrencies = response.response;
        $scope.currencyCodes = [];
        angular.forEach(response.response, function (currency) {
            $scope.currencyCodes[currency.id] = currency.code;
          }
        );
      }
    );

    var getDailyExchangeRates = cashBagFactory.getDailyExchangeRates(companyId, $routeParams.scheduleDate).then(
      function (response) {
        $scope.dailyExchangeRates = response.dailyExchangeRates;
      }
    );

    switch ($routeParams.state) {
      case 'edit':
      case 'view':
        var getCashBag = cashBagFactory.getCashBag($routeParams.id).then(
          function (response) {
            $scope.cashBag = response;
            $scope.displayError = false;
            $scope.formErrors = {};
          },
          showErrors
        );
        break;
      default:
        $scope.cashBag = {
          eposCashBagsId: null,
          chCompanyId: '362',
          isSubmitted: 'false',
          retailCompanyId:companyId,
          scheduleDate: $routeParams.scheduleDate,
          scheduleNumber: $routeParams.scheduleNumber,
          cashBagCurrencies: []
        };
        $q.all([getDailyExchangeRates, getCompanyCurrencies]).then(function(){
          // TODO: throw error when dailyExchangeRates returns empty array
          console.log($scope.dailyExchangeRates);
          $scope.cashBag.dailyExchangeRateId = $scope.dailyExchangeRates[0].id; // TODO: why is dailyExchangeRates an array?
          angular.forEach($scope.companyCurrencies, function(currency){
            $scope.cashBag.cashBagCurrencies.push({
              currencyId:currency.id,
              bankAmount:'0.0000'});
          });
        });
        break;
    }



    //$q.all([getCashBag, getCompany, getCompanyCurrencies]).then(function(){
    //  // All promises met
    //});

  });
