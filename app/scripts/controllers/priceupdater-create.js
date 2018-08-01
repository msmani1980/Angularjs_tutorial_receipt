'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PriceupdaterCreateCtrl
 * @description
 * # PriceupdaterCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PriceupdaterCreateCtrl', function($scope, $q, $location, dateUtility, $routeParams, priceupdaterFactory, messageService, currencyFactory, companiesFactory, lodash) {

    var $this = this;
    $scope.viewName = 'Price Update Rule';
    $scope.shouldDisableEndDate = false;
    $scope.stations = [];
    $scope.rule = {
      startDate: '',
      endDate: '',
      bulkRuleStationException: []
    };
    $scope.taxIs = [{
      name: 'Included',
      value: true
    }, {
      name: 'Excluded',
      value: 'null'
    }, {
      name: 'Exempt',
      value: false
    }];

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Create Price Update Rule';
      $scope.viewEditItem = false;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Price Update Rule';
      $scope.viewEditItem = true;
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Price Update Rule';
      $scope.viewEditItem = true;
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    $scope.isRuleApplied = function(priceupdater) {
      return priceupdater.runBy !== null;
    };

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.priceUpdaterDataForm.$valid;
    };

    this.resetErrors = function() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function(priceupdater) {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Create Price Update Rule', 'Success');
      } else {
        $this.showToastMessage('success', 'Edit Price Update Rule', 'Success');
        if ($scope.isRuleApplied(priceupdater)) {
          priceupdaterFactory.applyPriceUpdateRules(priceupdater.id);
        }
      }

      $location.path('priceupdater-list');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.generateCurrency = function(currency, percentVal) {
      return {
        currencyId: ($scope.viewEditItem) ? currency.currencyId : currency.id,
        code: currency.code,
        amend: (percentVal) ? '0.00' : currency.price,
        limitPrice: currency.limitPrice
      };
    };

    this.generateStationCurrency = function(currency, stnIndex) {
      return {
        currencyId: ($scope.rule.bulkRuleStationException[stnIndex].id) ? currency.currencyId : currency.id,
        code: currency.code,
        amend: currency.price
      };
    };

    this.formatPriceCurrencies = function(percentVal) {
      var priceCurrencies = [];
      angular.forEach($scope.priceCurrencies, function (currency) {
        var newCurrency = $this.generateCurrency(currency, percentVal);
        priceCurrencies.push(newCurrency);
      }); 

      return priceCurrencies;
    };

    this.formatStationCurrencies = function(stationCurrList, index) {
      var stationCurrencies = [];
      angular.forEach(stationCurrList, function (currency) {
        var newCurrency = $this.generateStationCurrency(currency, index);
        if ($scope.rule.bulkRuleStationException[index].id) {
          newCurrency.id = currency.id;
        }

        stationCurrencies.push(newCurrency);
      });

      return stationCurrencies;
    };

    this.formatStationException = function(bulkArray) {
      var stationExpCurrencies = [];
      angular.forEach(bulkArray, function (bulk, index) {
        var ruleException = {
          startDate: dateUtility.formatDateForAPI(bulk.startDate),
          endDate: dateUtility.formatDateForAPI(bulk.endDate),
          taxIs: bulk.taxIs,
          stationId: bulk.stationId,
          bulkRuleStationExceptionCurrencies: $this.formatStationCurrencies(bulk.stationPriceCurrencies, index)	
        };
        if ($scope.viewEditItem && bulk.id) {
          ruleException.id = bulk.id;
        }

        if (bulk.startDate && bulk.endDate) {
          stationExpCurrencies.push(ruleException);
        }
      });

      return stationExpCurrencies;
    };

    this.createPriceUpdaterRule = function() {
      $this.showLoadingModal('Creating Price Update Rule');
      var payload = {
        categoryId: $scope.rule.categoryId,
        priceTypeId: $scope.rule.priceTypeId,
        taxFilter: $scope.rule.taxFilter,
        percentage: $scope.rule.percentage,
        stationId: $scope.rule.stationId,
        percentValue: $scope.rule.percentage ? $scope.rule.percentValue : null,
        bulkRuleStationException: $scope.rule.bulkRuleStationException ? $this.formatStationException($scope.rule.bulkRuleStationException) : [],
        prices: $this.formatPriceCurrencies($scope.rule.percentage),
        startDate: dateUtility.formatDateForAPI($scope.rule.startDate),
        endDate: dateUtility.formatDateForAPI($scope.rule.endDate)
      };

      priceupdaterFactory.createPriceUpdaterRule(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    this.editPriceUpdaterRule = function() {
      $this.showLoadingModal('Saving Price Update Rule Data');
      var payload = {
        id: $routeParams.id,
        categoryId: $scope.rule.categoryId,
        priceTypeId: $scope.rule.priceTypeId,
        taxFilter: $scope.rule.taxFilter,
        percentage: $scope.rule.percentage,
        percentValue: $scope.rule.percentage ? $scope.rule.percentValue : null,
        companyId: $scope.rule.companyId,
        prices: $this.formatPriceCurrencies($scope.rule.percentage),
        bulkRuleStationException: $scope.rule.bulkRuleStationException ? $this.formatStationException($scope.rule.bulkRuleStationException) : [],
        startDate: dateUtility.formatDateForAPI($scope.rule.startDate),
        endDate: dateUtility.formatDateForAPI($scope.rule.endDate)
      };

      priceupdaterFactory.updatePriceUpdaterRule(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
    };

    $scope.addStationException = function() {
      $scope.rule.bulkRuleStationException.push({
        startDate: '',
        endDate: '',
        stations: [],
        stationPriceCurrencies: []
      });
    };

    $scope.removeStationException = function(key) {
      $scope.rule.bulkRuleStationException.splice(key, 1);
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'PriceUpdaterRule');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.makeInitPromises = function() {
      var promises = [
        priceupdaterFactory.getSalesCategoriesList({}),
        priceupdaterFactory.getPriceTypesList({})
      ];

      return promises;
    };

    this.setPriceCurrencies = function(prices) {
      var priceCurrencies = [];
      angular.forEach(prices, function (currency) {
        currency.price = currency.amend;
        priceCurrencies.push(currency);
      });

      return priceCurrencies;
    };

    this.formatStnViewCurrency = function(response) {
      return {
        startDate: dateUtility.formatDateForApp(response.startDate),
        endDate: dateUtility.formatDateForApp(response.endDate),
        taxIs: response.taxIs,
        id: response.id,
        stationId: response.stationId,
        stationPriceCurrencies: $this.setPriceCurrencies(response.bulkRuleStationExceptionCurrencies)
      };
    };

    this.formatStnViewCurrencyList = function(bulkList) {
      var bulkStationException = [];
      angular.forEach(bulkList, function (bulk) {
        var exception = $this.formatStnViewCurrency(bulk);
        bulkStationException.push(exception);
      });

      return bulkStationException; 
    };

    this.priceUpdaterRuleSuccess = function(response) {
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);
      $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);
      $scope.priceCurrencies = $this.setPriceCurrencies(response.prices);
      $scope.rule = {
        id: response.id,
        categoryId: response.categoryId,
        priceTypeId: response.priceTypeId,
        percentage: response.percentage,
        percentValue: response.percentValue,
        bulkRuleStationException: response.bulkRuleStationException[0] ? $this.formatStnViewCurrencyList(response.bulkRuleStationException) : [],
        taxFilter: response.taxFilter === null ? 'null' : response.taxFilter,
        startDate: $scope.viewStartDate,
        companyId: response.companyId,
        endDate: $scope.viewEndDate
      };
    };

    this.initDependenciesSuccess = function(responseCollection) {
      $scope.salesCategories = angular.copy(responseCollection[0].salesCategories);
      $scope.priceTypes = angular.copy(responseCollection[1]);
      if ($routeParams.id) {
        priceupdaterFactory.getPriceUpdaterRule($routeParams.id).then($this.priceUpdaterRuleSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

    };

    this.setPriceCurrenciesList = function (response) {
      $scope.priceCurrencies = response.response;
    };

    this.setStationPriceCurrenciesList = function (response, stationIndex) {
      $scope.rule.bulkRuleStationException[stationIndex].stationPriceCurrencies = response.response;
    };

    this.removeStation = function (station, stationIndex, bulkIndex) {
      var index = $scope.stations.indexOf(station);
      if (index > -1 && parseInt(stationIndex) !== parseInt(bulkIndex)) {
        $scope.stations.splice(index, 1);
      }
    };

    this.setStationsList = function(response, stationIndex) {
      $scope.stations = response.response;
      angular.forEach($scope.rule.bulkRuleStationException, function (bulk, bulkIndex) {
        var stationMatch = lodash.findWhere($scope.stations, { id: bulk.stationId });
        $this.removeStation(stationMatch, stationIndex, bulkIndex);
      });

      $scope.rule.bulkRuleStationException[stationIndex].stations = $scope.stations;
    };

    this.getGlobalStationList = function(startDate, endDate, stationIndex) {
      var stationsFilter = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate)
      };
      return companiesFactory.getGlobalStationList(stationsFilter).then(function(data) {
        $this.setStationsList(data, stationIndex);
      });
    };

    this.getPriceCurrenciesList = function (startDate, endDate) {
      var currencyFilters = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate),
        isOperatedCurrency: true
      };
      currencyFactory.getCompanyCurrencies(currencyFilters).then($this.setPriceCurrenciesList);
    };

    this.getStationPriceCurrenciesList = function (startDate, endDate, stationIndex) {
      var currencyFilters = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate),
        isOperatedCurrency: true
      };
      currencyFactory.getCompanyCurrencies(currencyFilters).then(function(data) {
        $this.setStationPriceCurrenciesList(data, stationIndex);
      });
    };

    $scope.$watchGroup(['rule.startDate', 'rule.endDate'], function () {
      if ($scope.rule && $scope.rule.startDate && $scope.rule.endDate) {
        if ($scope.isCreate) {  
          $this.getPriceCurrenciesList($scope.rule.startDate, $scope.rule.endDate);
        }        
      }  
    });

    this.updateStationCurrencies = function(stationIndex) {
      var stationException = $scope.rule.bulkRuleStationException[stationIndex];
      if (!(stationException && stationException.startDate && stationException.endDate)) {
        return false;
      }

      if (!stationException.id) {
        $this.getStationPriceCurrenciesList(stationException.startDate, stationException.endDate, stationIndex);
      }

      $this.getGlobalStationList(stationException.startDate, stationException.endDate, stationIndex);  
    };

    this.checkStationExceptionUpdate = function(newData, oldData, stationIndex) {
      var newStationException = newData[stationIndex];
      var oldStationException = oldData[stationIndex];

      if ((oldStationException && (newStationException.startDate !== oldStationException.startDate || 
        newStationException.endDate !== oldStationException.endDate)) || !oldStationException) {
        $this.updateStationCurrencies(stationIndex);
      }
    };

    this.watchStationExceptions = function (newData, oldData) {
      if (!oldData) {
        return false;
      }
	
      for (var stationIndex in $scope.rule.bulkRuleStationException) {
        $this.checkStationExceptionUpdate(newData, oldData, stationIndex);
      }
    };

    $scope.$watch('rule.bulkRuleStationException', function (newData, oldData) {
      $this.watchStationExceptions(newData, oldData);
    }, true);

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
