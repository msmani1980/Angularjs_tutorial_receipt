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
  .controller('CashBagEditCtrl', function ($scope, $routeParams, $q, ngToast, cashBagFactory, factoryHelper) {

    // controller global properties
    var _companyId = null,
      _factoryHelper = factoryHelper;

    // scope properties
    $scope.viewName = 'Cash Bag';
    $scope.readOnly = true;
    $scope.displayError = false;

    // scope methods
    $scope.formSave = function (formCashBag) {
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

    // Constructor
    (function CONSTRUCTOR(){
      // set global controller properties
      _companyId = cashBagFactory.getCompanyId();

      // in object of our services, to be called with the factory helper
      var services = {
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
          return cashBagFactory.getCompany(_companyId).then(
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
          return cashBagFactory.getDailyExchangeRates(_companyId, $routeParams.scheduleDate).then(
            function (response) {
              $scope.dailyExchangeRates = response.dailyExchangeRates;
            }
          );
        }
      };

      _factoryHelper.setServices(services);

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
      var _promises = _factoryHelper.callServices(['getCompany', 'getCompanyCurrencies', 'getDailyExchangeRates']);

      $scope.readOnly = false;
      $scope.cashBag = {
        isSubmitted: 'false',
        retailCompanyId: _companyId,
        scheduleDate: $routeParams.scheduleDate,
        scheduleNumber: $routeParams.scheduleNumber,
        cashBagCurrencies: []
      };

      $q.all(_promises).then(function(){
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
      _factoryHelper.callServices(['getCashBag', 'getCompany', 'getCompanyCurrencies']);
    }

    // CRUD - Update
    function UPDATE(){
      $scope.readOnly = false;
      _factoryHelper.callServices(['getCashBag', 'getCompany', 'getCompanyCurrencies']);
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
