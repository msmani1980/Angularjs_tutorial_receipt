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
  .controller('CashBagCtrl', function ($scope, $routeParams, $q, $location, $localStorage, messageService, cashBagFactory,
                                       dateUtility, lodash, globalMenuService) {

    // controller global properties
    var _companyId = null;
    var _promises = [];
    var $this = this;

    // scope properties
    $scope.viewName = 'Cash Bag';
    $scope.readOnly = true;
    $scope.displayError = false;
    $scope.displayedScheduleDate = '';
    $scope.displayedCashierDate = dateUtility.formatDateForApp(dateUtility.now(), 'x');
    $scope.saveButtonName = '';
    $scope.state = '';
    delete $localStorage.isListFromEdit;

    function formatAsCurrency(valueToFormat) {
      return sprintf('%.2f', valueToFormat);
    }

    function showLoadingModal(text) {
      $scope.displayError = false;
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#bankReferenceNumber').focus();
      angular.element('#loading').modal('hide');
    }

    function showMessage(error, isError, message) {
      if (arguments.length < 2) {
        isError = true;
        message = 'error';
      }

      var className = isError ? 'warning' : 'success';

      messageService.display(className, '<strong>Cash bag</strong>:' + message + '!');

      if (error !== null && isError) {
        $scope.displayError = true;
        $scope.formErrors = error.data;
      }
    }

    // scope methods
    function cleanPayload(payload) {
      delete payload.storeNumber;
      angular.forEach(payload.cashBagCurrencies, function (currency) {
        delete currency.bankExchangeRate;
        delete currency.paperExchangeRate;
        delete currency.coinExchangeRate;
        delete currency.flightAmount;
        delete currency.currencyCode;
      });

      return payload;
    }

    function cashBagCreateSuccessHandler(newCashBag) {
      hideLoadingModal();
      $location.search('newId', newCashBag.id)
        .search('scheduleDate', null)
        .search('scheduleNumber', null)
        .search('storeInstanceId', null)
        .path('cash-bag-list');
    }

    function cashBagEditSuccessHandler() {
      hideLoadingModal();
      $location.path('cash-bag-list');
      showMessage(null, false, 'successfully updated');
    }

    function errorHandler(response) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(response);
    }

    function editCashBag(formData) {
      var saveCashBag = angular.copy(formData);
      saveCashBag.scheduleDate = moment(saveCashBag.scheduleDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
      $scope.cashBag.scheduleDate = saveCashBag.scheduleDate;
      var payload = {
        cashBag: saveCashBag
      };
      showLoadingModal('Saving Cash Bag');
      cashBagFactory.updateCashBag($routeParams.id, payload).then(cashBagEditSuccessHandler, errorHandler);
    }

    function createCashBag(formData) {
      showLoadingModal('Saving Cash Bag');
      formData.isDelete = false;
      cashBagFactory.createCashBag({
        cashBag: formData
      }).then(cashBagCreateSuccessHandler, errorHandler);
    }

    $scope.formSave = function () {
      if ($scope.cashBagCreateForm.$invalid) {
        return;
      }

      $localStorage.cashBagBankRefNumber = $scope.cashBag.bankReferenceNumber;
      var formData = cleanPayload(angular.copy($scope.cashBag));
      switch ($routeParams.state) {
        case 'edit':
          if (formData.isSubmitted === 'true') {
            showMessage(null, true, 'cannot edit cash bags that have been submitted!');
            break;
          }

          editCashBag(formData);
          break;
        case 'create':
          createCashBag(formData);
          break;
      }
    };

    function cashBagCurrenciesIsSet(cashBagCurrencies) {
      var isSet = true;
      angular.forEach(cashBagCurrencies, function (currency) {
        if (isSet) {
          if (currency.bankAmount !== '0.00' && currency.bankAmount !== null) {
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
      if (!$scope.companyPreferences || !$scope.companyPreferences.exchangeRateType) {
        return false;
      }

      return $scope.companyPreferences.exchangeRateType.choiceCode === 'BNK';
    };

    $scope.isTotalNumberOfCashBagsActivated = function () {
      if (!$scope.companyPreferences || !$scope.companyPreferences.totalNumberOfCashBags) {
        return false;
      }

      return $scope.companyPreferences.totalNumberOfCashBags.isSelected && $scope.companyPreferences.totalNumberOfCashBags
          .choiceCode === 'CSB';
    };

    $scope.isCashBagDeleted = function () {
      return ($scope.state !== 'create' && $scope.cashBag && $scope.cashBag.isDelete === 'true');
    };

    function getStoreResponseHandler(dataFromAPI) {
      hideLoadingModal();
      var storeData = angular.copy(dataFromAPI);
      $scope.cashBag.storeNumber = storeData.storeNumber;
    }

    function getStoreInstanceListResponseHandler(dataFromAPI) {
      var storeInstanceData = angular.copy(dataFromAPI);
      $scope.displayedScheduleDate = dateUtility.formatDateForApp(storeInstanceData.scheduleDate);
      $scope.cashBag.scheduleNumber = storeInstanceData.scheduleNumber;
      $scope.cashBag.scheduleDate = moment(storeInstanceData.scheduleDate, 'YYYY-MM-DD').format('YYYYMMDD').toString();
      cashBagFactory.getStoreList({
        id: storeInstanceData.storeId
      }).then(getStoreResponseHandler);
    }

    function setManualAmount(amount) {
      if (angular.isUndefined(amount) || amount === null) {
        return formatAsCurrency(0);
      }

      if (!angular.isNumber(parseInt(amount))) {
        return formatAsCurrency(0);
      }

      return formatAsCurrency(amount);
    }

    $scope.shouldShowBankRefNumberAlert = function () {
      return ($scope.state === 'edit' && $localStorage.cashBagBankRefNumber && $scope.oldBankRefNumber && $localStorage.cashBagBankRefNumber !== $scope.oldBankRefNumber);
    };

    function setBankReferenceNumberFromLocalStorage() {
      var shouldSaveBankRefNumber = ($scope.state !== 'view' && $scope.companyPreferences.defaultBankRefNumber && $scope.companyPreferences.defaultBankRefNumber.isSelected);
      $scope.oldBankRefNumber = $scope.cashBag.bankReferenceNumber || '';
      if ($localStorage.cashBagBankRefNumber && shouldSaveBankRefNumber) {
        $scope.cashBag.bankReferenceNumber = $localStorage.cashBagBankRefNumber;
      }
    }

    function promisesResponseHandler() {
      setBankReferenceNumberFromLocalStorage();
      if (angular.isUndefined($scope.dailyExchangeRates) || $scope.dailyExchangeRates.length === 0) {
        hideLoadingModal();
        return;
      }

      var dailyExchangeRateCurrencies = $scope.dailyExchangeRates[0].dailyExchangeRateCurrencies;
      $scope.cashBag.dailyExchangeRateId = $scope.dailyExchangeRates[0].id;

      angular.forEach($scope.cashBag.cashBagCurrencies, function (cashBagCurrency) {
        var dailyCurrency = lodash.findWhere(dailyExchangeRateCurrencies, {
          retailCompanyCurrencyId: cashBagCurrency.currencyId
        });
        if (dailyCurrency) {
          cashBagCurrency.currencyCode = $scope.currencyCodes[cashBagCurrency.currencyId];
          cashBagCurrency.paperExchangeRate = dailyCurrency.paperExchangeRate;
          cashBagCurrency.coinExchangeRate = dailyCurrency.coinExchangeRate;
          cashBagCurrency.bankExchangeRate = dailyCurrency.bankExchangeRate;
          cashBagCurrency.paperAmountManual = setManualAmount(cashBagCurrency.paperAmountManual);
          cashBagCurrency.coinAmountManual = setManualAmount(cashBagCurrency.coinAmountManual);
          cashBagCurrency.flightAmount = formatAsCurrency(parseFloat(cashBagCurrency.paperAmountEpos) +
            parseFloat(cashBagCurrency.coinAmountEpos));
          dailyExchangeRateCurrencies.splice(dailyExchangeRateCurrencies.indexOf(dailyCurrency), 1);
        }
      });

      angular.forEach(dailyExchangeRateCurrencies, function (currency) {
        $scope.cashBag.cashBagCurrencies.push({
          currencyId: currency.retailCompanyCurrencyId,
          currencyCode: $scope.currencyCodes[currency.retailCompanyCurrencyId],
          bankAmount: currency.bankExchangeRate,
          paperAmountManual: formatAsCurrency(0),
          coinAmountManual: formatAsCurrency(0),
          paperAmountEpos: 0,
          coinAmountEpos: 0,
          flightAmount: '-',
          paperExchangeRate: currency.paperExchangeRate,
          coinExchangeRate: currency.coinExchangeRate,
          bankExchangeRate: currency.bankExchangeRate
        });
      });
    }

    function getCashBag() {
      _promises.push(
        cashBagFactory.getCashBag($routeParams.id).then(function (response) {
          $scope.cashBag = angular.copy(response);
          if ($scope.cashBag.totalCashBags) {
            $scope.cashBag.totalCashBags = $scope.cashBag.totalCashBags.toString();
          }

          $scope.displayError = false;
          $scope.formErrors = {};
          $scope.showDeleteButton = canDelete($scope.cashBag);
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
      var chCompanyId = globalMenuService.getCompanyData().companyId;
      _promises.push(
        cashBagFactory.getCompany(chCompanyId).then(function (response) {
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

    function dailyExchangeByIdResponseHandler(exchangeRate) {
      $scope.dailyExchangeRates = [angular.copy(exchangeRate)];
      if ($routeParams.state === 'view' || $routeParams.state === 'edit') {
        promisesResponseHandler();
      }
    }

    function dailyExchangeResponseHandler(responseFromAPI) {
      $scope.dailyExchangeRates = angular.copy(responseFromAPI.dailyExchangeRates);
      if ($routeParams.state === 'view' || $routeParams.state === 'edit') {
        promisesResponseHandler();
      }
    }

    function getExchangeRates(cashBag) {
      if (cashBag && cashBag.dailyExchangeRateId) {
        _promises.push(
          cashBagFactory.getDailyExchangeById(_companyId, cashBag.dailyExchangeRateId).then(
            dailyExchangeByIdResponseHandler)
        );
      } else {
        var dailyExchangeDate = moment().format('YYYYMMDD');
        _promises.push(
          cashBagFactory.getDailyExchangeRates(_companyId, dailyExchangeDate).then(dailyExchangeResponseHandler)
        );
      }
    }

    function getCompanyPreferenceBy(preferences, featureName, optionName) {
      var result = null;
      angular.forEach(preferences, function (preference) {
        if (result === null && preference.featureName === featureName && preference.optionName === optionName) {
          result = preference;
        }
      });

      return result;
    }

    function setCashBagMaxLength() {
      var defaultLength = 25;
      $scope.cashBagNumberMaxLength = defaultLength;
      if ($scope.companyPreferences.cashbagNumberLength && $scope.companyPreferences.cashbagNumberLength.isSelected) {
        $scope.cashBagNumberMaxLength = $scope.companyPreferences.cashbagNumberLength.numericValue || defaultLength;
      }
    }

    function getCompanyPreferences() {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };

      _promises.push(
        cashBagFactory.getCompanyPreferences(payload, _companyId).then(function (companyPreferencesData) {
          var orderedPreferences = lodash.sortByOrder(angular.copy(companyPreferencesData.preferences),
            'startDate', 'desc');

          $scope.companyPreferences = {
            exchangeRateType: getCompanyPreferenceBy(orderedPreferences, 'Exchange Rate', 'Exchange Rate Type'),
            totalNumberOfCashBags: getCompanyPreferenceBy(orderedPreferences, 'Exchange Rate',
              'Total Number of Cash Bags'),
            defaultBankRefNumber: getCompanyPreferenceBy(orderedPreferences, 'Cash Bag', 'Default Bank Reference Number'),
            cashbagNumberLength: getCompanyPreferenceBy(orderedPreferences, 'Cash Bag', 'Cashbag Validation')
          };
          setCashBagMaxLength();
        })
      );
    }

    function setCreatePromises() {
      getCompany();
      getCashHandlerCompany();
      getCompanyCurrencies();
      getExchangeRates();
      getCompanyPreferences();
    }

    // CRUD - Create
    this.createCashBag = function () {
      setCreatePromises();
      cashBagFactory.getStoreInstance($routeParams.storeInstanceId).then(getStoreInstanceListResponseHandler);

      $scope.readOnly = false;
      $scope.cashBag = {
        isSubmitted: 'false',
        retailCompanyId: _companyId,
        storeInstanceId: $routeParams.storeInstanceId,
        cashBagCurrencies: []
      };

      $scope.saveButtonName = 'Create';

      $q.all(_promises).then(promisesResponseHandler, showMessage);
    };

    function setReadPromises() {
      getCashBag();
      getCompany();
      getCashHandlerCompany();
      getCompanyCurrencies();
      getCompanyPreferences();
    }

    // CRUD - Read
    this.viewCashBag = function () {
      setReadPromises();
      $q.all(_promises).then(function () {
        $scope.displayedScheduleDate = dateUtility.formatDateForApp($scope.cashBag.scheduleDate);
        $scope.displayedCashierDate = dateUtility.formatDateForApp($scope.cashBag.createdOn);
        getExchangeRates($scope.cashBag);
        if ($scope.cashBag.storeInstanceId) {
          cashBagFactory.getStoreInstance($scope.cashBag.storeInstanceId).then(
            getStoreInstanceListResponseHandler);
        } else {
          hideLoadingModal();
        }
      }, showMessage);
    };

    function setUpdatePromises() {
      getCashBag();
      getCompany();
      getCashHandlerCompany();
      getCompanyCurrencies();
      getCompanyPreferences();
    }

    // CRUD - Update
    this.editCashBag = function () {
      setUpdatePromises();
      $scope.readOnly = false;
      $q.all(_promises).then(function () {
        $scope.displayedScheduleDate = dateUtility.formatDateForApp($scope.cashBag.scheduleDate);
        $scope.saveButtonName = 'Save';
        getExchangeRates($scope.cashBag);
        if ($scope.cashBag.storeInstanceId) {
          cashBagFactory.getStoreInstance($scope.cashBag.storeInstanceId).then(
            getStoreInstanceListResponseHandler);
        } else {
          hideLoadingModal();
        }
      }, showMessage);
    };

    // Constructor
    function init() {
      showLoadingModal('Loading Cash Bag');
      _companyId = cashBagFactory.getCompanyId();
      $scope.state = $routeParams.state;
      var crudOperation = $routeParams.state + 'CashBag';
      if ($this[crudOperation]) {
        $this[crudOperation]();
      }
    }

    init();

    $scope.isFocusBankReferenceNumber = function () {
      return !!$localStorage.isEditFromList;
    };

  });
