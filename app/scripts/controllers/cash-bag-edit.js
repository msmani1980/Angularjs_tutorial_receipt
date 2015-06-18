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

    // controller properties
    var _this = this;
    _this.companyId = undefined;
    _this.services = undefined;

    // scope globals
    $scope.viewName = 'Cash Bag';
    $scope.readOnly = true;
    $scope.displayError = false;

    // Constructor
    (function CONSTRUCTOR(){
      // define global controller properties
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
            HELPERS.showErrors
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
          CREATE();
          break;
        case 'view':
          READ();
          break;
        case 'edit':
          UPDATE();
          break;
        case 'delete':
          DELETE();
          break;
        default:
          // TODO - redirect home?
          break;
      }
      DESTRUCTOR();
    })();

    // form action
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
            HELPERS.updateSuccess,
            HELPERS.showErrors
          );
          break;
        case 'create':
          cashBagFactory.createCashBag({cashBag: formCashBag}).then(function () {
            //TODO: redirect
            console.log('success');
          }, HELPERS.showErrors);
          break;
      }
    };

    // helpers
    function HELPERS() {
      return {
        showErrors: function (error) {
          ngToast.create({
            className: 'warning',
            dismissButton: true,
            content: '<strong>Cash bag</strong>: error!'
          });
          $scope.displayError = true;
          $scope.formErrors = error.data;
        },
        updateSuccess: function () {
          ngToast.create({
            className: 'success',
            dismissButton: true,
            content: '<strong>Cash bag</strong>: successfully updated!'
          });
          $scope.displayError = false;
          $scope.formErrors = {};
        }
      };
    }

    // CRUD - Create
    function CREATE(){
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
    }

    // CRUD - Read
    function READ(){
      _this.services.call(['getCashBag', 'getCompany', 'getCompanyCurrencies']);
    }

    // CRUD - Update
    function UPDATE(){
      $scope.readOnly = false;
      _this.services.call(['getCashBag', 'getCompany', 'getCompanyCurrencies']);
    }

    // CRUD - Delete
    function DELETE(){
      // TODO - this
    }

    // Destructor
    function DESTRUCTOR(){
      // TODO - teardown
    }

  });
