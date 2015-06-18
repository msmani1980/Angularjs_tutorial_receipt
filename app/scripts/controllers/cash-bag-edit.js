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

    var _this = this;
    this.companyId = undefined;
    this.services = undefined;

    $scope.viewName = 'Cash Bag';
    $scope.readOnly = true;
    $scope.displayError = false;

    $scope.save = function (formCashBag) {
      switch ($routeParams.state) {
        case 'edit':
          var saveCashBag = angular.copy(formCashBag);
          // TODO see how Luis is doing this in company-relationship-service, tsv154 branch
          saveCashBag.scheduleDate = moment(saveCashBag.scheduleDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
          $scope.cashBag.scheduleDate = saveCashBag.scheduleDate;
          var payload = {
            cashBag: saveCashBag
          };
          cashBagFactory.updateCashBag($routeParams.id, payload).then(
            _this.HELPERS.updateSuccess,
            _this.HELPERS.showErrors
          );
          break;
        case 'create':
          cashBagFactory.createCashBag({cashBag: formCashBag}).then(function () {
            //TODO: redirect
            console.log('success');
          }, _this.HELPERS.showErrors);
          break;
      }
    };


    this.HELPERS = {
      showErrors: function(error) {
        ngToast.create({
          className: 'warning',
          dismissButton: true,
          content: '<strong>Cash bag</strong>: error!'
        });
        $scope.displayError = true;
        $scope.formErrors = error.data;
      },
      updateSuccess: function(){
        ngToast.create({
          className: 'success',
          dismissButton: true,
          content: '<strong>Cash bag</strong>: successfully updated!'
        });
        $scope.displayError = false;
        $scope.formErrors = {};
      }
    };

    this.CREATE = function(){
      _this.services.call(['getCompany', 'getCompanyCurrencies', 'getDailyExchangeRates']);

      $scope.readOnly = false;
      $scope.cashBag = {
        isSubmitted: 'false',
        retailCompanyId: _this.companyId,
        scheduleDate: $routeParams.scheduleDate,
        scheduleNumber: $routeParams.scheduleNumber,
        cashBagCurrencies: []
      };

      $q.all(_this.services.promises).then(function(){
        // TODO: throw error when dailyExchangeRates returns empty array
        $scope.cashBag.dailyExchangeRateId = $scope.dailyExchangeRates[0].id; // TODO: why is dailyExchangeRates an array?
        angular.forEach($scope.companyCurrencies, function(currency){
          $scope.cashBag.cashBagCurrencies.push(
            {
              currencyId:currency.id,
              bankAmount:'0.0000'
            }
          );
        });
      });
    };

    this.READ = function(){
      _this.services.call(['getCashBag', 'getCompany', 'getCompanyCurrencies']);
    };

    this.UPDATE = function(){
      $scope.readOnly = false;
      _this.services.call(['getCashBag', 'getCompany', 'getCompanyCurrencies']);
    };

    this.DELETE = function(){
      // TODO - this
    };

    this.CONSTRUCTOR = (function(){
      _this.companyId = cashBagFactory.getCompanyId();
      _this.services = {
        promises: [],
        call: function(servicesArray){
          angular.forEach(servicesArray, function(_service){
            _this.services.promises.push(_this.services[_service]());
          });
        },
        getCashBag: function () {
          return cashBagFactory.getCashBag($routeParams.id).then(
            function (response) {
              $scope.cashBag = response;
              $scope.displayError = false;
              $scope.formErrors = {};
            },
            _this.HELPERS.showErrors
          );
        },
        getCompany: function(){
          return cashBagFactory.getCompany(_this.companyId).then(
            function (response) {
              $scope.company = response;
            }
          );
        },
        getCompanyCurrencies: function(){
          return cashBagFactory.getCompanyCurrencies().then(
            function (response) {
              $scope.companyCurrencies = response.response;
              $scope.currencyCodes = [];
              angular.forEach(response.response, function (currency) {
                $scope.currencyCodes[currency.id] = currency.code;
              });
            }
          );
        },
        getDailyExchangeRates: function () {
          return cashBagFactory.getDailyExchangeRates(_this.companyId, $routeParams.scheduleDate).then(
            function (response) {
              $scope.dailyExchangeRates = response.dailyExchangeRates;
            }
          );
        }
      };

      switch ($routeParams.state) {
        case 'create':
          _this.CREATE();
          break;
        case 'view':
          _this.READ();
          break;
        case 'edit':
          _this.UPDATE();
          break;
        case 'delete':
          _this.DELETE();
          break;
        default:
          // TODO - redirect home?
          break;
      }
    })();

  });
