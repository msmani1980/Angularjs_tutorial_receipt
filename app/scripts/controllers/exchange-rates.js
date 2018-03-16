'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ExchangeRatesCtrl
 * @description
 * # ExchangeRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExchangeRatesCtrl', function($rootScope, $scope, $http, currencyFactory, globalMenuService, $q, messageService,
    dateUtility, lodash, accessService) {

    $scope.viewName = 'Daily Exchange Rates';
    $scope.cashiersDateField = dateUtility.nowFormattedDatePicker();
    $scope.cashHandlerBaseCurrency = {};
    $scope.showActionButtons = false;
    $scope.companyCurrencies = [];
    $scope.companyPreferences = [];
    $scope.companyBaseCurrency = {};
    $scope.currenciesFields = {};
    $scope.dailyExchangeRates = {};
    $scope.previousExchangeRates = {};
    $scope.payload = {};

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
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

    $scope.isBankExchangePreferred = function() {
      if (!$scope.companyPreferences || !$scope.companyPreferences.exchangeRateType) {
        return false;
      }

      return $scope.companyPreferences.exchangeRateType.choiceCode === 'BNK';
    };

    function formatDateForAPI(cashiersDate) {
      return dateUtility.formatDateForAPI(cashiersDate);
    }

    function getExchangeRateFromCompanyCurrencies(currenciesArray, currencyId) {
      if (!currenciesArray || !currencyId) {
        return null;
      }

      return currenciesArray.filter(function(currencyItem) {
        return currencyItem.retailCompanyCurrencyId === currencyId;
      })[0];
    }

    var getCurrencyFromArrayUsingId = function(currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function(currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    function serializeExchangeRates(currencyCode, coinExchangeRate, paperExchangeRate, bankExchangeRate, recordId) {
      $scope.currenciesFields[currencyCode] = {};
      if ($scope.isBankExchangePreferred()) {
        $scope.currenciesFields[currencyCode].bankExchangeRate = bankExchangeRate;
      } else {
        $scope.currenciesFields[currencyCode].coinExchangeRate = coinExchangeRate;
        $scope.currenciesFields[currencyCode].paperExchangeRate = paperExchangeRate;
      }

      if (recordId) {
        $scope.currenciesFields[currencyCode].recordId = recordId;
      }
    }

    function setBaseExchangeRateModel() {
      var existingExchangeRate = getExchangeRateFromCompanyCurrencies($scope.dailyExchangeRates.dailyExchangeRateCurrencies, $scope.cashHandlerBaseCurrency.id);
      var recordId = !!existingExchangeRate && $scope.dailyExchangeRates.id ? existingExchangeRate.id : null;

      if ($scope.cashHandlerBaseCurrency.currencyCode && $scope.dailyExchangeRates) {
        serializeExchangeRates($scope.cashHandlerBaseCurrency.currencyCode, '1.0000', '1.0000', '1.0000', recordId);
      }
    }

    function setPreviousExchangeRatesModel() {
      if ($scope.dailyExchangeRates && !$scope.dailyExchangeRates.dailyExchangeRateCurrencies) {
        $scope.dailyExchangeRates = angular.extend($scope.previousExchangeRates, {
          isSubmitted: false,
          id: null,
          exchangeRateDate: formatDateForAPI($scope.cashiersDateField)
        });
      }
    }

    function setCurrentExchangeRatesModel() {
      if ($scope.companyCurrencies && $scope.dailyExchangeRates && angular.isArray($scope.dailyExchangeRates.dailyExchangeRateCurrencies)) {
        angular.forEach($scope.companyCurrencies, function(companyCurrency) {
          var exchangeRate = getExchangeRateFromCompanyCurrencies($scope.dailyExchangeRates.dailyExchangeRateCurrencies,
            companyCurrency.id);
          if (exchangeRate) {
            serializeExchangeRates(companyCurrency.code, exchangeRate.coinExchangeRate, exchangeRate.paperExchangeRate,
              exchangeRate.bankExchangeRate, exchangeRate.id);
          }
        });
      }
    }

    function serializePreviousExchangeRates() {
      $scope.previousCurrency = {};
      if ($scope.previousExchangeRates && angular.isArray($scope.previousExchangeRates.dailyExchangeRateCurrencies)) {
        angular.forEach($scope.companyCurrencies, function(companyCurrency) {
          var exchangeRate = getExchangeRateFromCompanyCurrencies($scope.previousExchangeRates.dailyExchangeRateCurrencies,
            companyCurrency.id);
          if (exchangeRate) {
            $scope.previousCurrency[companyCurrency.code] = {
              coinExchangeRate: exchangeRate.coinExchangeRate,
              paperExchangeRate: exchangeRate.paperExchangeRate,
              bankExchangeRate: exchangeRate.bankExchangeRate
            };
          }
        });
      }
    }

    function shouldShowActionButtons() {
      var isToday = dateUtility.isTodayDatePicker($scope.cashiersDateField);
      if (!isToday) {
        return false;
      }

      return !(isToday && $scope.dailyExchangeRates.isSubmitted);
    }

    function setupModels() {
      $scope.currenciesFields = {};
      setPreviousExchangeRatesModel();
      setCurrentExchangeRatesModel();
      setBaseExchangeRateModel();
      $scope.showActionButtons = shouldShowActionButtons();
    }

    function getExchangeRates (cashiersDate) {
      showLoadingModal('Retrieving Exchange Rates');
      var companyId = globalMenuService.getCompanyData().chCompany.companyId;

      var formattedDateForAPI = formatDateForAPI(cashiersDate);
      var companyCurrenciesPayload = {
        startDate: formattedDateForAPI,
        endDate: formattedDateForAPI
      };
      var companyCurrencyPromise = currencyFactory.getCompanyCurrencies(companyCurrenciesPayload);
      var previousRatePromise = currencyFactory.getPreviousExchangeRates(companyId, formattedDateForAPI);
      var currentRatePromise = currencyFactory.getDailyExchangeRates(companyId, formattedDateForAPI);

      $q.all([companyCurrencyPromise, previousRatePromise, currentRatePromise]).then(function(apiData) {
        $scope.companyCurrencies = apiData[0].response;
        $scope.previousExchangeRates = apiData[1] || {};
        $scope.dailyExchangeRates = apiData[2].dailyExchangeRates[0] || {};
        setupModels();
        hideLoadingModal();
      });
    }

    $scope.$watch('cashiersDateField', function(cashiersDate) {
      if (!dateUtility.isDateValidForApp(cashiersDate)) {
        return;
      }

      getExchangeRates(cashiersDate);
    });

    function clearExchangeRateCurrencies() {
      $scope.payload.dailyExchangeRateCurrencies = [];
    }

    function clearUnusedRates() {
      $scope.payload.dailyExchangeRateCurrencies.map(function(rate) {
        if ($scope.isBankExchangePreferred()) {
          delete rate.coinExchangeRate;
          delete rate.paperExchangeRate;
        } else {
          delete rate.bankExchangeRate;
        }
      });
    }

    function cleanPayloadData() {
      delete $scope.payload.createdBy;
      delete $scope.payload.createdOn;
      delete $scope.payload.updatedBy;
      delete $scope.payload.updatedOn;
      clearUnusedRates();
    }

    function serializeExchangeRateForAPI(currency) {
      var coinExchangeRate = '1.0000';
      var paperExchangeRate = '1.0000';
      var bankExchangeRate = '1.0000';

      if ($scope.currenciesFields[currency.code]) {
        coinExchangeRate = $scope.currenciesFields[currency.code].coinExchangeRate;
        paperExchangeRate = $scope.currenciesFields[currency.code].paperExchangeRate;
        bankExchangeRate = $scope.currenciesFields[currency.code].bankExchangeRate;
      }

      var serializedCurrency = {
        retailCompanyCurrencyId: currency.id,
        coinExchangeRate: coinExchangeRate,
        paperExchangeRate: paperExchangeRate,
        bankExchangeRate: bankExchangeRate
      };

      if ($scope.currenciesFields[currency.code].recordId && $scope.payload.id) {
        serializedCurrency.id = $scope.currenciesFields[currency.code].recordId;
      }

      return serializedCurrency;
    }

    function resolvePayloadDependencies() {
      clearExchangeRateCurrencies();
      angular.forEach($scope.companyCurrencies, function(currency) {
        if ($scope.currenciesFields[currency.code]) {
          var companyCurrency = serializeExchangeRateForAPI(currency);
          $scope.payload.dailyExchangeRateCurrencies.push(companyCurrency);
        }
      });
    }

    function createPayload(shouldSubmit) {
      var dailyExchangeRatePayload = {
        exchangeRateDate: formatDateForAPI($scope.cashiersDateField),
        isSubmitted: shouldSubmit || false,
        chCompanyId: $scope.cashHandlerCompany.id,
        retailCompanyId: $scope.company.id,
        chBaseCurrencyId: $scope.cashHandlerCompany.baseCurrencyId,
        retailBaseCurrencyId: $scope.company.baseCurrencyId,
        dailyExchangeRateCurrencies: $scope.dailyExchangeRates.dailyExchangeRateCurrencies || []
      };

      if ($scope.dailyExchangeRates.id) {
        dailyExchangeRatePayload.id = $scope.dailyExchangeRates.id;
      }

      $scope.payload = dailyExchangeRatePayload;
      resolvePayloadDependencies();
      cleanPayloadData();
    }

    function showErrors(dataFromAPI) {
      $scope.errorResponse = dataFromAPI;
      $scope.displayError = true;
      setupModels();
      hideLoadingModal();
      disableActionButtons(false, true);
    }

    function showSuccessMessage() {
      var action = $scope.submitButtonPressed ? 'submitted' : 'saved';
      var message = 'successfully ' + action + '!';

      $rootScope.$broadcast('DEXsaved');
      messageService.display('success', message, 'Daily Exchange Rates');
    }

    function disableActionButtons(shouldDisable, saveOrSubmit) {
      var buttonSelector = saveOrSubmit ? '.submit-btn' : '.save-btn';
      var buttonState = shouldDisable ? 'loading' : 'reset';
      $scope.requestInProgress = shouldDisable;
      angular.element(buttonSelector).button(buttonState);
    }

    function successRequestHandler() {
      hideLoadingModal();
      showSuccessMessage();
      disableActionButtons(false);
      getExchangeRates($scope.cashiersDateField);
    }

    function getPercentageForCurrency(currencyCode, rateType) {
      var currentValue = $scope.currenciesFields[currencyCode][rateType];
      var previousValue = $scope.previousCurrency[currencyCode][rateType];
      var percentage = Math.floor((100 - (currentValue / previousValue) * 100));
      return Math.abs(percentage);
    }

    function calculateVariance() {
      var rateVariance = [];
      angular.forEach($scope.currenciesFields, function(currencyObject, currencyCode) {
        if ($scope.previousCurrency[currencyCode]) {
          angular.forEach(currencyObject, function(rate, rateType) {
            var percentage = getPercentageForCurrency(currencyCode, rateType);
            if ($scope.percentThreshold >= 0 && percentage && percentage > $scope.percentThreshold) {
              rateVariance.push({
                code: currencyCode,
                percentage: percentage
              });
            }
          });
        }
      });

      return rateVariance;
    }

    $scope.saveDailyExchangeRates = function(shouldSubmit) {
      $scope.submitButtonPressed = shouldSubmit;
      angular.element('.variance-warning-modal').modal('hide');
      disableActionButtons(true, shouldSubmit);
      var loadingText = shouldSubmit ? 'Submitting Daily Exchange Rates' : 'Saving Daily Exchange Rates';
      showLoadingModal(loadingText);
      currencyFactory.saveDailyExchangeRates($scope.payload).then(successRequestHandler, showErrors);
    };

    $scope.checkVarianceAndSave = function(shouldSubmit) {
      if (!$scope.dailyExchangeRatesForm.$valid) {
        return false;
      }

      serializePreviousExchangeRates();
      createPayload(shouldSubmit);

      $scope.varianceObject = calculateVariance();
      if (Object.keys($scope.varianceObject).length > 0) {
        angular.element('.variance-warning-modal').modal('show');
        return;
      }

      $scope.saveDailyExchangeRates(shouldSubmit);
    };

    function getCompanyBaseCurrency(baseCurrencyId) {
      currencyFactory.getCompanyGlobalCurrencies().then(function(companyBaseCurrencyData) {
        $scope.companyBaseCurrency = getCurrencyFromArrayUsingId(companyBaseCurrencyData.response, baseCurrencyId);
        setupModels();
      });
    }

    function getCashHandlerBaseCurrency(baseCurrencyId) {
      currencyFactory.getCompanyGlobalCurrencies().then(function(companyBaseCurrencyData) {
        $scope.cashHandlerBaseCurrency = getCurrencyFromArrayUsingId(companyBaseCurrencyData.response,
          baseCurrencyId);
        setupModels();
      });
    }

    function completeInit (responseCollection) {
      var orderedPreferences = lodash.sortByOrder(angular.copy(responseCollection[0].preferences), 'startDate', 'desc');
      $scope.companyPreferences = {
        exchangeRateType: getCompanyPreferenceBy(orderedPreferences, 'Cash Bag', 'Exchange Rate Type')
      };

      getCompanyBaseCurrency(angular.copy(responseCollection[1].baseCurrencyId));
      $scope.company = angular.copy(responseCollection[1]);

      getCashHandlerBaseCurrency(angular.copy(responseCollection[2].baseCurrencyId));
      $scope.cashHandlerCompany = angular.copy(responseCollection[2]);

      var activeThreshold = (!!responseCollection[3].response && responseCollection[3].response.length) ? angular.copy(responseCollection[3].response[0]) : null;
      $scope.percentThreshold = (!!activeThreshold) ? activeThreshold.percentage : -1;

      hideLoadingModal();
    }

    function makeInitPromises () {
      var today = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      var preferencePayload = {
        optionName: 'Exchange Rate Type',
        date: today
      };

      var thresholdPayload = {
        startDate: today,
        endDate: today
      };

      var retailCompanyId = globalMenuService.getCompanyData().chCompany.companyId;
      var chCompanyId = globalMenuService.getCompanyData().id;

      return [
        currencyFactory.getCompanyPreferences(preferencePayload, retailCompanyId),
        currencyFactory.getCompany(retailCompanyId),
        currencyFactory.getCompany(chCompanyId),
        currencyFactory.getExchangeRateThresholdList(thresholdPayload, retailCompanyId)
      ];
    }

    function init() {
      showLoadingModal('Initializing Data');
      $scope.isSubmit = accessService.crudAccessGranted('CASH', 'DAILYEXCHANGERATE', 'SBMTDER');
      var promises = makeInitPromises();
      $q.all(promises).then(completeInit, showErrors);
    }

    init();

  });
