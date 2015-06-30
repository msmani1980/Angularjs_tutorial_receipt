'use strict';
/*global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:CashBagCtrl
 * @description
 * @author kmeath
 * # CashBagCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagCtrl', function ($scope, $routeParams, $q, $location, ngToast, cashBagFactory, factoryHelper) {

    // controller global properties
    var _companyId = null,
      _factoryHelper = factoryHelper;

    // scope properties
    $scope.viewName = 'Cash Bag';
    $scope.readOnly = true;
    $scope.displayError = false;
    $scope.displayedScheduleDate = '';
    $scope.displayedCashierDate = '';
    $scope.saveButtonName = '';
    $scope.state = '';

    var helpers = {
      showMessage: function(error, isError, message) {
        if(arguments.length < 2) {
          isError = true;
          message = 'error';
        }
        var className = isError ? 'warning' : 'success';
        ngToast.create({
          className: className,
          dismissButton: true,
          content: '<strong>Cash bag</strong>:' + message + '!'
        });
        if(error !== null && isError) {
          $scope.displayError = true;
          $scope.formErrors = error.data;
        }
      },
      canDelete: function (cashBag) {
        var canDelete = true;
        angular.forEach(cashBag.cashBagCurrencies, function (currency) {
          if (canDelete) {
            if (currency.bankAmount !== '0.0000' && currency.bankAmount !== null) {
              canDelete = false;
            }
            if (currency.coinAmountManual !== null) {
              canDelete = false;
            }
            if (currency.coinAmountManual !== null) {
              canDelete = false;
            }
          }
        });
        return canDelete;
      }
    };

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
            helpers.showMessage(null, false, 'successfully updated'),
            helpers.showMessage
          );
          break;
        case 'create':
          cashBagFactory.createCashBag({cashBag: formCashBag}).then(function (newCashBag) {
            $location.search('newId', newCashBag.id)
              .search('scheduleDate', null)
              .search('scheduleNumber', null)
              .path('cash-bag-list');
          }, helpers.showMessage);
          break;
      }
    };
    $scope.canDelete = function () {
      return false;
    };
    $scope.delete = function (cashBag) {
      if ($scope.canDelete(cashBag)) {
        cashBagFactory.deleteCashBag(cashBag.id).then(function () {
            window.alert('deleted');
          },
          helpers.showMessage);
      }
    };

    $scope.isBankExchangePreferred = function () {
      if (!$scope.companyPreferences) {
        return false;
      }

      return $scope.companyPreferences.filter(function (feature) {
          return (feature.featureCode === 'EXR' && feature.optionCode === 'CSB' && feature.choiceCode === 'CSB');
        }).length > 0;
    };

    // Constructor
    (function constructor() {
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
            helpers.showMessage
          );
        },
        getCompany: function () {
          return cashBagFactory.getCompany(_companyId).then(
            function (response) {
              $scope.company = response;
            }
          );
        },
        getCashHandlerCompany: function () {
          // TODO: get correct cash handler company
          return cashBagFactory.getCompany(362).then(
            function (response) {
              $scope.cashHandlerCompany = response;
            }
          );
        },
        getCompanyCurrencies: function () {
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
          return cashBagFactory.getDailyExchangeRates(_companyId, moment().format('YYYYMMDD')).then(
            function (response) {
              $scope.dailyExchangeRates = response.dailyExchangeRates;
            }
          );
        },
        getCompanyPreferences: function () {
          return cashBagFactory.getCompanyPreferences().then(function(response){
            $scope.companyPreferences = response.preferences;
          });
        }
      };

      _factoryHelper.setServices(services);
      $scope.state = $routeParams.state;
      switch ($routeParams.state) {
        case 'create':
          create();
          break;
        case 'view':
          read();
          break;
        case 'edit':
          update();
          break;
        default:
          // TODO - redirect home?
          break;
      }
    })();



    // CRUD - Create
    function create() {
      var _promises = _factoryHelper.callServices(['getCompany', 'getCashHandlerCompany', 'getCompanyCurrencies', 'getDailyExchangeRates', 'getCompanyPreferences']);

      $scope.readOnly = false;
      $scope.cashBag = {
        isSubmitted: 'false',
        retailCompanyId: _companyId,
        scheduleDate: $routeParams.scheduleDate,
        scheduleNumber: $routeParams.scheduleNumber,
        cashBagCurrencies: []
      };
      $scope.displayedScheduleDate = moment($routeParams.scheduleDate, 'YYYYMMDD').format('YYYY-MM-DD').toString();
      $scope.displayedCashierDate = moment().format('YYYY-MM-DD');
      $scope.saveButtonName = 'Create';

      $q.all(_promises).then(function () {
        if (angular.isArray($scope.dailyExchangeRates) && $scope.dailyExchangeRates.length > 0) {
          $scope.cashBag.dailyExchangeRateId = $scope.dailyExchangeRates[0].id;
        } else {
            helpers.showMessage(null, true, 'no daily exchange rate created for this date! please create one on exchange rates page');
        }
        angular.forEach($scope.dailyExchangeRates[0].dailyExchangeRateCurrencies, function (currency) {
          $scope.cashBag.cashBagCurrencies.push(
            {
              currencyId: currency.retailCompanyCurrencyId,
              bankAmount: currency.bankExchangeRate,
              paperAmountManual: '0.0000',
              coinAmountManual: '0.0000',
              paperAmountEpos: currency.paperExchangeRate,
              coinAmountEpos: currency.coinExchangeRate
            }
          );
        });

      });
    }

    // CRUD - Read
    function read() {
      var _promises = _factoryHelper.callServices(['getCashBag', 'getCompany', 'getCashHandlerCompany', 'getCompanyCurrencies', 'getCompanyPreferences']);
      $q.all(_promises).then(function () {
        $scope.displayedScheduleDate = $scope.cashBag.scheduleDate;
        $scope.displayedCashierDate = moment($scope.cashBag.createdOn, 'YYYY-MM-DD hh:mm:ss.SSSSSS').format('YYYY-MM-DD');
      });
    }

    // CRUD - Update
    function update() {
      $scope.readOnly = false;
      var _promises = _factoryHelper.callServices(['getCashBag', 'getCompany', 'getCashHandlerCompany', 'getCompanyCurrencies', 'getCompanyPreferences']);
      $q.all(_promises).then(function () {
        $scope.canDelete = helpers.canDelete;
        $scope.displayedScheduleDate = $scope.cashBag.scheduleDate;
        $scope.displayedCashierDate = moment($scope.cashBag.createdOn, 'YYYY-MM-DD hh:mm:ss.SSSSSS').format('YYYY-MM-DD');
        $scope.saveButtonName = 'Save';
      });
    }

  });
