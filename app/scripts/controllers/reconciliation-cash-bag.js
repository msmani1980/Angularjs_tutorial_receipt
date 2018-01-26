'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagCtrl
 * @description
 * @author kmeath
 * # CashBagCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationCashBagCtrl', function($scope, $routeParams, $q, $location, $localStorage, messageService,
    cashBagFactory, dateUtility, lodash, globalMenuService) {

    // controller global properties
    var _companyId = null;
    var _promises = [];
    var $this = this;

    // scope properties
    $scope.viewName = 'Cash Bag';
    $scope.readOnly = true;
    $scope.displayError = false;
    $scope.displayedScheduleDate = '';
    $scope.displayedCashierDate = dateUtility.nowFormattedDatePicker();
    $scope.saveButtonName = '';
    delete $localStorage.isListFromEdit;

    function formatAsCurrency(valueToFormat) {
      return sprintf('%.4f', valueToFormat);
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
      $location.search('storeInstanceId', null)
        .path('cash-bag-list');

      showMessage(null, false, 'successfully updated');
    }

    function errorHandler(response) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(response);
    }

    $scope.isBankExchangePreferred = function() {
      if (!$scope.companyPreferences || !$scope.companyPreferences.exchangeRateType) {
        return false;
      }

      return $scope.companyPreferences.exchangeRateType.choiceCode === 'BNK';
    };

    $scope.isTotalNumberOfCashBagsActivated = function() {
      if (!$scope.companyPreferences || !$scope.companyPreferences.totalNumberOfCashBags) {
        return false;
      }

      return $scope.companyPreferences.totalNumberOfCashBags.isSelected && $scope.companyPreferences.totalNumberOfCashBags
        .choiceCode === 'CSB';
    };

    $scope.isCashBagDeleted = function() {
      return ($scope.cashBag && $scope.cashBag.isDelete === true);
    };

    function getStoreResponseHandler(dataFromAPI) {
      hideLoadingModal();
      var storeData = angular.copy(dataFromAPI);
      $scope.cashBag.storeNumber = storeData.storeNumber;
      angular.element('#cashBagNumber').focus();
    }

    function getStoreInstanceListResponseHandler(dataFromAPI) {
      var storeInstanceData = angular.copy(dataFromAPI);
      $scope.displayedScheduleDate = dateUtility.formatDateForApp(storeInstanceData.scheduleDate);
      $scope.cashBag.scheduleNumber = storeInstanceData.scheduleNumber;
      $scope.cashBag.scheduleDate = dateUtility.formatDateForApp(storeInstanceData.scheduleDate);
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

    $scope.getCashHandlerBaseCurrencyCode = function () {
      if($scope.cashHandlerCompany) {
        return $scope.currencyCodes[$scope.cashHandlerCompany.baseCurrencyId];
      } else {
        return'-'
      }
    };

    function setBankReferenceNumberFromLocalStorage() {
      var shouldSaveBankRefNumber = ($scope.companyPreferences.defaultBankRefNumber &&
              $scope.companyPreferences.defaultBankRefNumber.isSelected);
      $scope.oldBankRefNumber = $scope.cashBag.bankReferenceNumber || '';
      $scope.oldCashBagNumber = $scope.cashBag.cashBagNumber;

      if ($localStorage.cashBagBankRefNumber && shouldSaveBankRefNumber && $scope.cashBag.bankReferenceNumber === null && $localStorage.cashBagBankRefNumberDate === dateUtility.nowFormattedDatePicker()) {
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

      angular.forEach($scope.cashBag.cashBagCurrencies, function(cashBagCurrency) {
        cashBagCurrency.currencyCode = $scope.currencyCodes[cashBagCurrency.currencyId];
        cashBagCurrency.paperAmountManual = setManualAmount(cashBagCurrency.paperAmountManual);
        cashBagCurrency.coinAmountManual = setManualAmount(cashBagCurrency.coinAmountManual);
        cashBagCurrency.flightAmount = formatAsCurrency(parseFloat(cashBagCurrency.paperAmountEpos) +
          parseFloat(cashBagCurrency.coinAmountEpos));

        var dailyCurrency = lodash.findWhere(dailyExchangeRateCurrencies, {
          retailCompanyCurrencyId: cashBagCurrency.currencyId
        });

        if (dailyCurrency) {
          cashBagCurrency.paperExchangeRate = dailyCurrency.paperExchangeRate;
          cashBagCurrency.coinExchangeRate = dailyCurrency.coinExchangeRate;
          cashBagCurrency.bankExchangeRate = dailyCurrency.bankExchangeRate;
          dailyExchangeRateCurrencies.splice(dailyExchangeRateCurrencies.indexOf(dailyCurrency), 1);
        }
      });

      angular.forEach(dailyExchangeRateCurrencies, function(currency) {
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

      $scope.cashBag.cashBagCurrencies = lodash.filter($scope.cashBag.cashBagCurrencies, function (currency) {
        var hasExchangeRate = !!currency.paperExchangeRate || !!currency.coinExchangeRate || !!currency.bankExchangeRate;
        var hasAmount = (parseFloat(currency.paperAmountManual) + parseFloat(currency.coinAmountManual)) > 0;

        return hasAmount || hasExchangeRate;
      });
    }

    function getCashBag() {
      _promises.push(
        cashBagFactory.getCashBag($routeParams.id).then(function(response) {
          $scope.cashBag = angular.copy(response);
          if ($scope.cashBag.totalCashBags) {
            $scope.cashBag.totalCashBags = $scope.cashBag.totalCashBags.toString();
          }

          if ($scope.cashBag.storeInstanceId === null && $routeParams.storeInstanceId) {
            $scope.cashBag.storeInstanceId = $routeParams.storeInstanceId;
          }

          if($scope.cashBag.chCompanyId) {
            cashBagFactory.getCompany($scope.cashBag.chCompanyId).then(function(response) {
              $scope.cashHandlerCompany = angular.copy(response);
            });
          }

          $scope.displayError = false;
          $scope.formErrors = {};
        })
      );
    }

    function getCompany() {
      _promises.push(
        cashBagFactory.getCompany(_companyId).then(function(response) {
          $scope.company = response;
        })
      );
    }

    function getCompanyCurrencies() {
      _promises.push(
        cashBagFactory.getCompanyCurrencies().then(function(response) {
          $scope.companyCurrencies = angular.copy(response.response);
          $scope.currencyCodes = [];
          angular.forEach(response.response, function(currency) {
            $scope.currencyCodes[currency.id] = currency.code;
          });
        })
      );
    }

    function dailyExchangeByIdResponseHandler(exchangeRate) {
      $scope.dailyExchangeRates = [angular.copy(exchangeRate)];
      promisesResponseHandler();
    }

    function dailyExchangeResponseHandler(responseFromAPI) {
      $scope.dailyExchangeRates = angular.copy(responseFromAPI.dailyExchangeRates);
      promisesResponseHandler();
    }

    function getExchangeRates(cashBag) {
      if (cashBag && cashBag.dailyExchangeRateId) {
        _promises.push(
          cashBagFactory.getDailyExchangeById(_companyId, cashBag.dailyExchangeRateId).then(
            dailyExchangeByIdResponseHandler)
        );
      } else {
        var dailyExchangeDate = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
        _promises.push(
          cashBagFactory.getDailyExchangeRates(_companyId, dailyExchangeDate).then(dailyExchangeResponseHandler)
        );
      }
    }

    function getCompanyPreferenceBy(preferences, featureName, optionName) {
      var result = null;
      angular.forEach(preferences, function(preference) {
        if (result === null && preference.featureName === featureName && preference.optionName === optionName) {
          result = preference;
        }
      });

      return result;
    }

    function setCashBagMaxLength() {
      var defaultLength = 10;
      $scope.cashBagNumberMaxLength = defaultLength;
      if ($scope.companyPreferences.cashbagNumberLength && $scope.companyPreferences.cashbagNumberLength
        .isSelected) {
        $scope.cashBagNumberMaxLength = $scope.companyPreferences.cashbagNumberLength.numericValue || defaultLength;
      }
    }

    function getCompanyPreferences() {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
      };

      _promises.push(
        cashBagFactory.getCompanyPreferences(payload, _companyId).then(function(companyPreferencesData) {
          var orderedPreferences = lodash.sortByOrder(angular.copy(companyPreferencesData.preferences),
            'startDate', 'desc');

          $scope.companyPreferences = {
            exchangeRateType: getCompanyPreferenceBy(orderedPreferences, 'Cash Bag', 'Exchange Rate Type'),
            totalNumberOfCashBags: getCompanyPreferenceBy(orderedPreferences, 'Exchange Rate',
              'Total Number of Cash Bags'),
            defaultBankRefNumber: getCompanyPreferenceBy(orderedPreferences, 'Cash Bag',
              'Default Bank Reference Number'),
            cashbagNumberLength: getCompanyPreferenceBy(orderedPreferences, 'Cash Bag', 'Cashbag Validation')
          };
          setCashBagMaxLength();
        })
      );
    }

    function setReadPromises() {
      getCashBag();
      getCompany();
      getCompanyCurrencies();
      getCompanyPreferences();
    }

    // CRUD - Read
    this.viewCashBag = function() {
      setReadPromises();
      $q.all(_promises).then(function() {
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

    // Constructor
    function init() {
      showLoadingModal('Loading Cash Bag');
      _companyId = cashBagFactory.getCompanyId();
      $this.viewCashBag();
    }

    init();

    $scope.isFocusBankReferenceNumber = function() {
      return !!$localStorage.isEditFromList;
    };

  });
