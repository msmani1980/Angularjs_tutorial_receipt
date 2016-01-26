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
  .controller('CashBagCtrl', function($scope, $routeParams, $q, $location, $localStorage, ngToast, cashBagFactory,
    dateUtility, lodash) {

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
    function cleanPayload(payload) {
      delete payload.storeNumber;
      angular.forEach(payload.cashBagCurrencies, function(currency) {
        delete currency.bankExchangeRate;
        delete currency.paperExchangeRate;
        delete currency.coinExchangeRate;
        delete currency.flightAmount;
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

    $scope.formSave = function() {
      if ($scope.cashBagCreateForm.$invalid) {
        return;
      }

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
      angular.forEach(cashBagCurrencies, function(currency) {
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

    $scope.removeRecord = function(cashBag) {
      if (!canDelete(cashBag)) {
        return false;
      }

      cashBagFactory.deleteCashBag(cashBag.id).then(function() {
          showMessage(null, false, 'successfully deleted');
          $scope.readOnly = true;
        },

        showMessage);
    };

    $scope.isBankExchangePreferred = function() {
      if (!$scope.companyPreferences) {
        return false;
      }

      return $scope.companyPreferences.filter(function(feature) {
        return (feature.featureCode === 'EXR' && feature.optionCode === 'ERT' && feature.choiceCode === 'BNK');
      }).length > 0;
    };

    $scope.isCashBagDeleted = function() {
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

    function promisesResponseHandler() {
      if (angular.isUndefined($scope.dailyExchangeRates) || $scope.dailyExchangeRates.length === 0) {
        showMessage(null, true,
          'no daily exchange rate created for this date! please create one on exchange rates page');
        hideLoadingModal();
        return;
      }

      var dailyExchangeRateCurrencies = $scope.dailyExchangeRates[0].dailyExchangeRateCurrencies;
      $scope.cashBag.dailyExchangeRateId = $scope.dailyExchangeRates[0].id;

      angular.forEach($scope.cashBag.cashBagCurrencies, function(cashBagCurrency) {
        var dailyCurrency = lodash.findWhere(dailyExchangeRateCurrencies, {
          retailCompanyCurrencyId: cashBagCurrency.currencyId
        });
        if (dailyCurrency) {
          cashBagCurrency.paperExchangeRate = dailyCurrency.paperExchangeRate;
          cashBagCurrency.coinExchangeRate = dailyCurrency.coinExchangeRate;
          cashBagCurrency.bankExchangeRate = dailyCurrency.bankExchangeRate;
          cashBagCurrency.flightAmount = formatAsCurrency(parseFloat(cashBagCurrency.paperAmountEpos) +
            parseFloat(cashBagCurrency.coinAmountEpos));
          dailyExchangeRateCurrencies.splice(dailyExchangeRateCurrencies.indexOf(dailyCurrency), 1);
        }
      });

      angular.forEach(dailyExchangeRateCurrencies, function(currency) {
        $scope.cashBag.cashBagCurrencies.push({
          currencyId: currency.retailCompanyCurrencyId,
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
        cashBagFactory.getCashBag($routeParams.id).then(function(response) {
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
        cashBagFactory.getCompany(_companyId).then(function(response) {
          $scope.company = response;
        })
      );
    }

    function getCashHandlerCompany() {
      // TODO: get correct cash handler company
      _promises.push(
        cashBagFactory.getCompany(362).then(function(response) {
          $scope.cashHandlerCompany = angular.copy(response);
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

    function getCompanyPreferences() {
      _promises.push(
        cashBagFactory.getCompanyPreferences().then(function(response) {
          $scope.companyPreferences = angular.copy(response.preferences);
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
    this.createCashBag = function() {
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

    function setUpdatePromises() {
      getCashBag();
      getCompany();
      getCashHandlerCompany();
      getCompanyCurrencies();
      getCompanyPreferences();
    }

    // CRUD - Update
    this.editCashBag = function() {
      setUpdatePromises();
      $scope.readOnly = false;
      $q.all(_promises).then(function() {
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

    $scope.isFocusBankReferenceNumber = function() {
      return !!$localStorage.isEditFromList;
    };

  });
