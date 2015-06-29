'use strict';

/*global moment:false */
/**
 * @ngdoc function
 * @name ts5App.controller:ExchangeRatesCtrl
 * @description
 * # ExchangeRatesCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExchangeRatesCtrl', function ($scope, $http, currencyFactory, GlobalMenuService, $q, ngToast) {
    var companyId = GlobalMenuService.company.get();

    $scope.viewName = 'Daily Exchange Rates';
    $scope.cashiersDateField = new moment().format('L');
    $scope.showActionButtons = false;
    $scope.companyCurrencies = [];
    $scope.companyPreferences = [];
    $scope.companyBaseCurrency = {};
    $scope.currenciesFields = {};
    $scope.dailyExchangeRates = {};
    $scope.previousExchangeRates = {};
    $scope.payload = {};

    function formatDateForAPI(cashiersDate) {
      return moment(cashiersDate, 'L').format('YYYYMMDD').toString();
    }

    function getExchangeRateFromCompanyCurrencies(currenciesArray, currencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.retailCompanyCurrencyId === currencyId;
      })[0];
    }

    var getCurrencyFromArrayUsingId = function (currenciesArray, baseCurrencyId) {
      return currenciesArray.filter(function (currencyItem) {
        return currencyItem.id === baseCurrencyId;
      })[0];
    };

    function serializeExchangeRates(currencyCode, coinExchangeRate, paperExchangeRate, bankExchangeRate) {
      $scope.currenciesFields[currencyCode] = {
        coinExchangeRate: coinExchangeRate,
        paperExchangeRate: paperExchangeRate,
        bankExchangeRate: bankExchangeRate
      };
    }

    function setBaseExchangeRateModel() {
      if ($scope.companyBaseCurrency.currencyCode && $scope.dailyExchangeRates) {
        serializeExchangeRates($scope.companyBaseCurrency.currencyCode, '1.0000', '1.0000', '1.0000');
      }
    }

    function setPreviousExchangeRatesModel() {
      if ($scope.dailyExchangeRates && !$scope.dailyExchangeRates.dailyExchangeRateCurrencies) {
        $scope.dailyExchangeRates = angular.extend($scope.previousExchangeRates,
          {
            isSubmitted: false,
            exchangeRateDate: formatDateForAPI($scope.cashiersDateField)
          });
      }
    }

    function setCurrentExchangeRatesModel() {
      if ($scope.companyCurrencies && $scope.dailyExchangeRates && angular.isArray($scope.dailyExchangeRates.dailyExchangeRateCurrencies)) {
        angular.forEach($scope.companyCurrencies, function (companyCurrency) {
          var exchangeRate = getExchangeRateFromCompanyCurrencies($scope.dailyExchangeRates.dailyExchangeRateCurrencies, companyCurrency.id);
          if (exchangeRate) {
            serializeExchangeRates(companyCurrency.code, exchangeRate.coinExchangeRate, exchangeRate.paperExchangeRate, exchangeRate.bankExchangeRate);
          }
        });
      }
    }

    function serializePreviousExchangeRates() {
      $scope.previousCurrency = {};
      if ($scope.previousExchangeRates && angular.isArray($scope.previousExchangeRates.dailyExchangeRateCurrencies)) {
        angular.forEach($scope.companyCurrencies, function (companyCurrency) {
          var exchangeRate = getExchangeRateFromCompanyCurrencies($scope.previousExchangeRates.dailyExchangeRateCurrencies, companyCurrency.id);
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
      var isToday = moment($scope.cashiersDateField, 'L').format('L') === moment().format('L');
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

    $scope.$watch('cashiersDateField', function (cashiersDate) {
      if (!moment(cashiersDate, 'L', true).isValid()) {
        return;
      }
      var formattedDateForAPI = formatDateForAPI(cashiersDate);
      var companyCurrenciesPayload = {
        startDate: formattedDateForAPI,
        endDate: formattedDateForAPI
      };
      var companyCurrencyPromise = currencyFactory.getCompanyCurrencies(companyCurrenciesPayload);
      var previousRatePromise = currencyFactory.getPreviousExchangeRates(companyId, formattedDateForAPI);
      var currentRatePromise = currencyFactory.getDailyExchangeRates(companyId, formattedDateForAPI);

      $q.all([companyCurrencyPromise, previousRatePromise, currentRatePromise]).then(function (apiData) {
        $scope.companyCurrencies = apiData[0].response;
        $scope.previousExchangeRates = apiData[1] || {};
        $scope.dailyExchangeRates = apiData[2].dailyExchangeRates[0] || {};
        setupModels();
      });
    });

    function clearExchangeRateCurrencies() {
      $scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies = [];
    }

    function serializeExchangeRateForAPI(currency) {
      var coinExchangeRate = '1.0000',
        paperExchangeRate = '1.0000',
        bankExchangeRate = '1.0000';

      if ($scope.currenciesFields[currency.code]) {
        coinExchangeRate = $scope.currenciesFields[currency.code].coinExchangeRate;
        paperExchangeRate = $scope.currenciesFields[currency.code].paperExchangeRate;
        bankExchangeRate = $scope.currenciesFields[currency.code].bankExchangeRate;
      }

      return {
        retailCompanyCurrencyId: currency.id,
        coinExchangeRate: coinExchangeRate,
        paperExchangeRate: paperExchangeRate,
        bankExchangeRate: bankExchangeRate
      };
    }

    function resolvePayloadDependencies() {
      clearExchangeRateCurrencies();
      angular.forEach($scope.companyCurrencies, function (currency) {
        if ($scope.currenciesFields[currency.code]) {
          var companyCurrency = serializeExchangeRateForAPI(currency);
          $scope.payload.dailyExchangeRate.dailyExchangeRateCurrencies.push(companyCurrency);
        }
      });
    }

    function createPayload(shouldSubmit) {
      $scope.payload = {
        dailyExchangeRate: angular.extend($scope.dailyExchangeRates,
          {
            isSubmitted: shouldSubmit || false,
            exchangeRateDate: formatDateForAPI($scope.cashiersDateField)
          })
      };
      resolvePayloadDependencies();
    }

    function showErrors(dataFromAPI) {
      if ('data' in dataFromAPI) {
        $scope.formErrors = dataFromAPI.data;
      }
      $scope.displayError = true;
      setupModels();
    }

    function showSuccessMessage(savedOrSubmitted) {
      ngToast.create({
        className: 'success',
        dismissButton: true,
        content: '<strong>Daily Exchange Rates</strong>: successfully ' + savedOrSubmitted + '!'
      });
    }

    function disableActionButtons(shouldDisable, saveOrSubmit) {
      var buttonSelector = saveOrSubmit ? '.submit-btn' : '.save-btn';
      var buttonState = shouldDisable ? 'loading' : 'reset';
      $scope.requestInProgress = shouldDisable;
      angular.element(buttonSelector).button(buttonState);
    }

    function successRequestHandler(dailyExchangeRatesData) {
      $scope.dailyExchangeRates = dailyExchangeRatesData || {isSubmitted: false};
      var savedOrSubmitted = $scope.dailyExchangeRates.isSubmitted ? 'submitted' : 'saved';
      setupModels();
      disableActionButtons(false);
      showSuccessMessage(savedOrSubmitted);
    }

    function calculateVariance() {
      var rateVariance = [];
      angular.forEach($scope.currenciesFields, function (currencyObject, currencyCode) {
        if ($scope.previousCurrency[currencyCode]) {
          angular.forEach(currencyObject, function (rate, rateType) {
            var percentage = Math.floor((100 - ($scope.currenciesFields[currencyCode][rateType] / $scope.previousCurrency[currencyCode][rateType]) * 100));
            if (percentage > 10) {
              rateVariance.push({
                  code: currencyCode,
                  percentage: percentage
                }
              );
            }
          });
        }
      });
      return rateVariance;
    }

    $scope.checkVarianceAndSave = function(shouldSubmit) {
      if (!$scope.dailyExchangeRatesForm.$valid){
        return false;
      }
      disableActionButtons(true, shouldSubmit);
      serializePreviousExchangeRates();
      createPayload(shouldSubmit);

      $scope.varianceObject = calculateVariance();
      if (Object.keys($scope.varianceObject).length > 0) {
        angular.element('.variance-warning-modal').modal('show');
        return;
      }
      $scope.saveDailyExchangeRates();
    };

    $scope.saveDailyExchangeRates = function () {
      angular.element('.variance-warning-modal').modal('hide');
      currencyFactory.saveDailyExchangeRates($scope.payload).then(successRequestHandler, showErrors);
    };

    $scope.isBankExchangePreferred = function () {
      if (!$scope.companyPreferences) {
        return false;
      }

      return $scope.companyPreferences.filter(function (feature) {
          return (feature.featureCode === 'EXR' && feature.optionCode === 'ERT' && feature.choiceCode === 'BNK');
        }).length > 0;
    };

    function getCompanyBaseCurrency(baseCurrencyId) {
      currencyFactory.getCompanyGlobalCurrencies().then(function (companyBaseCurrencyData) {
        $scope.companyBaseCurrency = getCurrencyFromArrayUsingId(companyBaseCurrencyData.response, baseCurrencyId);
        setupModels();
      });
    }

    currencyFactory.getCompanyPreferences().then(function (companyPreferencesData) {
      $scope.companyPreferences = companyPreferencesData.preferences;
    });

    currencyFactory.getCompany(companyId).then(function (companyDataFromAPI) {
      getCompanyBaseCurrency(companyDataFromAPI.baseCurrencyId);
      $scope.company = companyDataFromAPI;
    });

    currencyFactory.getCompany(362).then(function (companyDataFromAPI) {
      $scope.cashHandlerCompany = companyDataFromAPI;
    });

  });
