'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PriceupdaterCreateCtrl
 * @description
 * # PriceupdaterCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PriceupdaterCreateCtrl', function($scope, $q, $location, dateUtility, $routeParams, priceupdaterFactory, messageService, currencyFactory, companiesFactory) {

    var $this = this;
    $scope.viewName = 'Price Update Rule';
    $scope.shouldDisableEndDate = false;
    $scope.hasStationCurrencies = false;
    $scope.stations = [];
    $scope.rule = {
      startDate: '',
      endDate: ''
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
        currencyId: ($scope.viewEditItem && !percentVal) ? currency.currencyId : currency.id,
        code: currency.code,
        amend: currency.price
      };
    };

    this.generateStationCurrency = function(currency) {
      return {
        currencyId: ($scope.isCreate || !$scope.hasStationCurrencies) ? currency.id : currency.currencyId,
        code: currency.code,
        amend: currency.price
      };
    };

    this.formatPriceCurrencies = function(percentVal) {
      var priceCurrencies = [];
      if (!percentVal) {
        angular.forEach($scope.priceCurrencies, function (currency) {
          var newCurrency = $this.generateCurrency(currency, percentVal);
          priceCurrencies.push(newCurrency);
        });
      }  

      return priceCurrencies;
    };

    this.formatStationCurrencies = function(percentVal) {
      var stationCurrencies = [];
      if (!percentVal) {
        angular.forEach($scope.stationPriceCurrencies, function (currency) {
          var newCurrency = $this.generateStationCurrency(currency);
          if ($scope.viewEditItem && $scope.hasStationCurrencies) {
            newCurrency.id = currency.id;
          }

          stationCurrencies.push(newCurrency);
        });
      }  

      return stationCurrencies;
    };

    this.formatStationException = function(bulk) {
      var stationExpCurrencies = [];
      var ruleException = {
        startDate: dateUtility.formatDateForAPI(bulk.startDate),
        endDate: dateUtility.formatDateForAPI(bulk.endDate),
        taxIs: bulk.taxIs,
        percentage: bulk.percentage,
        stationId: bulk.stationId,
        percentValue: bulk.percentValue,
        bulkRuleStationExceptionCurrencies: $this.formatStationCurrencies(bulk.percentage)	
      };
      if ($scope.viewEditItem && bulk.id) {
        ruleException.id = bulk.id;
      }

      stationExpCurrencies.push(ruleException);
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
        percentValue: $scope.rule.percentValue,
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
        percentValue: $scope.rule.percentValue,
        companyId: $scope.rule.companyId,
        prices: $this.formatPriceCurrencies($scope.rule.percentage),
        bulkRuleStationException: ($scope.rule.bulkRuleStationException && $scope.rule.bulkRuleStationException.startDate) ? 
          $this.formatStationException($scope.rule.bulkRuleStationException) : [],
        startDate: dateUtility.formatDateForAPI($scope.rule.startDate),
        endDate: dateUtility.formatDateForAPI($scope.rule.endDate)
      };

      priceupdaterFactory.updatePriceUpdaterRule(payload).then(
        $this.saveFormSuccess, $this.saveFormFailure
      );
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
      $scope.hasStationCurrencies = true;
      return {
        startDate: dateUtility.formatDateForApp(response.startDate),
        endDate: dateUtility.formatDateForApp(response.endDate),
        taxIs: response.taxIs,
        id: response.id,
        percentage: response.percentage,
        stationId: response.stationId,
        percentValue: response.percentValue	
      };
    };

    this.priceUpdaterRuleSuccess = function(response) {
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);
      $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);
      $scope.priceCurrencies = $this.setPriceCurrencies(response.prices);
      $scope.stationPriceCurrencies = response.bulkRuleStationException[0] ? 
        $this.setPriceCurrencies(response.bulkRuleStationException[0].bulkRuleStationExceptionCurrencies) : [];
      $scope.rule = {
        id: response.id,
        categoryId: response.categoryId,
        priceTypeId: response.priceTypeId,
        percentage: response.percentage,
        percentValue: response.percentValue,
        bulkRuleStationException: response.bulkRuleStationException[0] ? $this.formatStnViewCurrency(response.bulkRuleStationException[0]) : [],
        taxFilter: response.taxFilter === null ? 'null' : response.taxFilter,
        startDate: $scope.viewStartDate,
        companyId: response.companyId,
        endDate: $scope.viewEndDate
      };
      if (response.percentage && !$scope.isDisabled()) {
        $this.getPriceCurrenciesList($scope.rule.startDate, $scope.rule.endDate); 
      } 
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

    this.setStationPriceCurrenciesList = function (response) {
      $scope.stationPriceCurrencies = response.response;
    };

    this.setStationsList = function(response) {
      $scope.stations = response.response;
    };

    this.getGlobalStationList = function(startDate, endDate) {
      var stationsFilter = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate)
      };
      return companiesFactory.getGlobalStationList(stationsFilter).then($this.setStationsList);
    };

    this.getPriceCurrenciesList = function (startDate, endDate) {
      var currencyFilters = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate),
        isOperatedCurrency: true
      };
      currencyFactory.getCompanyCurrencies(currencyFilters).then($this.setPriceCurrenciesList);
    };

    this.getStationPriceCurrenciesList = function (startDate, endDate) {
      var currencyFilters = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate),
        isOperatedCurrency: true
      };
      currencyFactory.getCompanyCurrencies(currencyFilters).then($this.setStationPriceCurrenciesList);
    };

    $scope.$watchGroup(['rule.startDate', 'rule.endDate'], function () {
      if ($scope.rule && $scope.rule.startDate && $scope.rule.endDate) {
        if ($scope.isCreate) {  
          $this.getPriceCurrenciesList($scope.rule.startDate, $scope.rule.endDate);
        }        
      }  
    });

    $scope.$watchGroup(['rule.bulkRuleStationException.startDate', 'rule.bulkRuleStationException.endDate'], function () {
      if ($scope.rule && $scope.rule.bulkRuleStationException && $scope.rule.bulkRuleStationException.startDate && $scope.rule.bulkRuleStationException.endDate) {
        if (!$scope.rule.bulkRuleStationException.id) {  
          $this.getStationPriceCurrenciesList($scope.rule.bulkRuleStationException.startDate, $scope.rule.bulkRuleStationException.endDate);
        }

        $this.getGlobalStationList($scope.rule.bulkRuleStationException.startDate, $scope.rule.bulkRuleStationException.endDate);  
      }
    });

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
