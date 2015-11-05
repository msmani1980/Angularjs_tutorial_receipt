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
  .controller('CashBagCtrl', function ($scope, $routeParams, $q, $location, ngToast, cashBagFactory, dateUtility) {

    // controller global properties
    var _companyId = null;
    var _promises = [];

    // scope properties
    $scope.viewName = 'Cash Bag';
    $scope.readOnly = true;
    $scope.displayError = false;
    $scope.displayedScheduleDate = '';
    $scope.displayedCashierDate = '';
    $scope.saveButtonName = '';
    $scope.state = '';

    function showMessage(error, isError, message) {
      if (arguments.length < 2) {
        isError = true;
        message = 'error';
      }
      var className = isError ? 'warning' : 'success';
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>Cash bag</strong>:' + message + '!'
      });
      if (error !== null && isError) {
        $scope.displayError = true;
        $scope.formErrors = error.data;
      }
    }

    // scope methods
    $scope.formSave = function (payloadFromForm) {
      switch ($routeParams.state) {
        case 'edit':
          if (payloadFromForm.isSubmitted === 'true') {
            showMessage(null, true, 'cannot edit cash bags that have been submitted!');
            break;
          }
          var saveCashBag = angular.copy(payloadFromForm);
          saveCashBag.totalCashBags = parseInt(saveCashBag.totalCashBags, 10);
          saveCashBag.scheduleDate = moment(saveCashBag.scheduleDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
          $scope.cashBag.scheduleDate = saveCashBag.scheduleDate;
          var payload = {
            cashBag: saveCashBag
          };
          cashBagFactory.updateCashBag($routeParams.id, payload).then(
            showMessage(null, false, 'successfully updated'),
            showMessage
          );
          break;
        case 'create':
          delete payloadFromForm.storeNumber;
          payloadFromForm.isDelete = false;
          payloadFromForm.totalCashBags = parseInt(payloadFromForm.totalCashBags, 10);
          cashBagFactory.createCashBag({cashBag: payloadFromForm}).then(function (newCashBag) {
            $location.search('newId', newCashBag.id)
              .search('scheduleDate', null)
              .search('scheduleNumber', null)
              .search('storeInstanceId', null)
              .path('cash-bag-list');
          }, showMessage);
          break;
      }
    };

    function cashBagCurrenciesIsSet(cashBagCurrencies) {
      var isSet = true;
      angular.forEach(cashBagCurrencies, function (currency) {
        if (isSet) {
          if (currency.bankAmount !== '0.0000' && currency.bankAmount !== null) {
            isSet = false;
          }
          if (currency.coinAmountManual !== null) {
            isSet = false;
          }
          if (currency.paperAmountManual !== null) {
            isSet = false;
          }
        }
      });
      return isSet;
    }

    function canDelete(cashBag) {
      if ($scope.state !== 'edit') {
        return false;
      }
      if ($scope.readOnly) {
        return false;
      }
      if (cashBag.isSubmitted === 'true') {
        return false;
      }
      if (cashBag.isDelete === 'true') {
        return false;
      }
      return cashBagCurrenciesIsSet(cashBag.cashBagCurrencies);
    }

    $scope.removeRecord = function (cashBag) {
      if (!canDelete(cashBag)) {
        return false;
      }
      cashBagFactory.deleteCashBag(cashBag.id).then(function () {
          showMessage(null, false, 'successfully deleted');
          $scope.readOnly = true;
        },
        showMessage);
    };

    $scope.isBankExchangePreferred = function () {
      if (!$scope.companyPreferences) {
        return false;
      }
      return $scope.companyPreferences.filter(function (feature) {
          return (feature.featureCode === 'EXR' && feature.optionCode === 'ERT' && feature.choiceCode === 'BNK');
        }).length > 0;
    };

    $scope.isCashBagDeleted = function () {
      return ($scope.state !== 'create' && $scope.cashBag && $scope.cashBag.isDelete === 'true');
    };

    function getStoreResponseHandler(dataFromAPI) {
      var storeData = angular.copy(dataFromAPI);
      $scope.cashBag.storeNumber = storeData.storeNumber;
    }

    function getStoreInstanceListResponseHandler(dataFromAPI) {
      var storeInstanceData = angular.copy(dataFromAPI);
      $scope.displayedScheduleDate = dateUtility.formatDateForApp(storeInstanceData.scheduleDate);
      $scope.cashBag.scheduleNumber = storeInstanceData.scheduleNumber;
      $scope.cashBag.scheduleDate = moment(storeInstanceData.scheduleDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
      cashBagFactory.getStoreList({id: storeInstanceData.storeId}).then(getStoreResponseHandler);
    }

    function promisesResponseHandler() {
      if (angular.isArray($scope.dailyExchangeRates) && $scope.dailyExchangeRates.length > 0) {
        $scope.cashBag.dailyExchangeRateId = $scope.dailyExchangeRates[0].id;
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
      } else {
        showMessage(null, true, 'no daily exchange rate created for this date! please create one on exchange rates page');
      }
    }

    function getCashBag() {
      _promises.push(
        cashBagFactory.getCashBag($routeParams.id).then(function (response) {
          $scope.cashBag = angular.copy(response);
          $scope.displayError = false;
          $scope.formErrors = {};
          $scope.showDeleteButton = canDelete(response);

          if ($scope.cashBag.eposCashBagsId === null) {
            $scope.flightAmount = '0.0000';
          } else {
            // TODO: API call to get flight amount based on eposCashBagsId
            $scope.flightAmount = '-';
          }
        })
      );
    }

    function getCompany() {
      _promises.push(
        cashBagFactory.getCompany(_companyId).then(function (response) {
          $scope.company = response;
        })
      );
    }

    function getCashHandlerCompany() {
      // TODO: get correct cash handler company
      _promises.push(
        cashBagFactory.getCompany(362).then(function (response) {
          $scope.cashHandlerCompany = angular.copy(response);
        })
      );

    }

    function getCompanyCurrencies() {
      _promises.push(
        cashBagFactory.getCompanyCurrencies().then(function (response) {
          $scope.companyCurrencies = angular.copy(response.response);
          $scope.currencyCodes = [];
          angular.forEach(response.response, function (currency) {
            $scope.currencyCodes[currency.id] = currency.code;
          });
        })
      );
    }

    function getDailyExchangeRates() {
      _promises.push(
        cashBagFactory.getDailyExchangeRates(_companyId, moment().format('YYYYMMDD')).then(function (response) {
          $scope.dailyExchangeRates = angular.copy(response.dailyExchangeRates);
        })
      );
    }

    function getCompanyPreferences() {
      _promises.push(
        cashBagFactory.getCompanyPreferences().then(function (response) {
          $scope.companyPreferences = angular.copy(response.preferences);
        })
      );
    }

    function setCreatePromises() {
      getCompany();
      getCashHandlerCompany();
      getCompanyCurrencies();
      getDailyExchangeRates();
      getCompanyPreferences();
    }

    // CRUD - Create
    function create() {
      setCreatePromises();
      cashBagFactory.getStoreInstanceList({id: $routeParams.storeInstanceId}).then(getStoreInstanceListResponseHandler);


      $scope.readOnly = false;
      $scope.cashBag = {
        isSubmitted: 'false',
        retailCompanyId: _companyId,
        storeInstanceId: $routeParams.storeInstanceId,
        cashBagCurrencies: []
      };
      $scope.displayedCashierDate = dateUtility.formatDateForApp(dateUtility.now(), 'x');
      $scope.saveButtonName = 'Create';

      $q.all(_promises).then(promisesResponseHandler, showMessage);
    }

    function setReadPromises() {
      getCashBag();
      getCompany();
      getCashHandlerCompany();
      getCompanyCurrencies();
      getCompanyPreferences();
    }

    // CRUD - Read
    function read() {
      setReadPromises();
      $q.all(_promises).then(function () {
        $scope.displayedScheduleDate = dateUtility.formatDateForApp($scope.cashBag.scheduleDate);
        $scope.displayedCashierDate = dateUtility.formatDateForApp($scope.cashBag.createdOn);
        cashBagFactory.getStoreInstanceList({id: $scope.cashBag.storeInstanceId}).then(getStoreInstanceListResponseHandler);
      }, showMessage);
    }

    function setUpdatePromises() {
      getCashBag();
      getCompany();
      getCashHandlerCompany();
      getCompanyCurrencies();
      getCompanyPreferences();
    }

    // CRUD - Update
    function update() {
      setUpdatePromises();
      $scope.readOnly = false;
      $q.all(_promises).then(function () {
        $scope.displayedScheduleDate = dateUtility.formatDateForApp($scope.cashBag.scheduleDate);
        $scope.displayedCashierDate = dateUtility.formatDateForApp($scope.cashBag.createdOn);
        $scope.saveButtonName = 'Save';
        cashBagFactory.getStoreInstanceList({id: $scope.cashBag.storeInstanceId}).then(getStoreInstanceListResponseHandler);
      }, showMessage);
    }

    // Constructor
    function init() {
      // set global controller properties
      _companyId = cashBagFactory.getCompanyId();
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
      }
    }

    init();

  });
