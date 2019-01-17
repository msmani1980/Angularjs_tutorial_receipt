'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReceiptRulesCreateCtrl
 * @description
 * # ReceiptRulesCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReceiptRulesCreateCtrl', function ($scope, $location, $routeParams, $q, $filter, lodash, messageService, receiptsFactory, dateUtility) {
    var $this = this;
    var payload = null;
    
    $scope.displayError = false;
    $scope.readOnly = true;
    $scope.editing = false;
    $scope.viewName = 'Create Rules';
    $scope.saveButtonText = 'Create';
    $scope.activeBtn = 'receiptrules-information';
    $scope.selectOptions = {};
    $scope.globalStationList = [];
    $scope.multiSelectedValues = {};
    $scope.countriesList = [];
    $scope.globalCompanyCurrecnyList = [];
    $scope.receiptRule = [];
    $scope.receiptRule.countryId = null;
    $scope.receiptFloorLimitAmountsUi = [];
    $scope.multiSelectedValues.globalStationList = null;

    $scope.onSelected = function() {
      $scope.receiptRuleFormData.Station.$setValidity('required', true);
    };

    $scope.formSave = function() {
      if (!$scope.receiptRuleFormData.Station.$modelValue || ($scope.receiptRuleFormData.Station.$modelValue && $scope.receiptRuleFormData.Station.$modelValue.length === 0)) {
        $scope.receiptRuleFormData.Station.$setValidity('required', false);
      } else {
        $scope.receiptRuleFormData.Station.$setValidity('required', true);
      }

      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'ReceiptRule');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };
      
    $scope.onCounrtyChange = function() {
      $scope.multiSelectedValues.globalStationList = null;
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
        countryId: $scope.receiptRule.countryId
      };
      return receiptsFactory.getCompanyGlobalStationList(payload).then($this.getCompanyGlobalStationSuccess);
    };
        
    this.showLoadingModal = function(message) {
        angular.element('#loading').modal('show').find('p').text(message);
      };

    this.hideLoadingModal = function() {
        angular.element('#loading').modal('hide');
      };

    this.createInit = function() {
        $scope.readOnly = false;
        $scope.isCreate = true;
        $scope.viewName = 'Create Rules';
      };

    this.viewInit = function() {
        $scope.readOnly = true;
        $scope.viewName = 'View Rules';
      };

    this.editInit = function() {
        $scope.readOnly = false;
        $scope.viewName = 'Edit Rules';
        $scope.editingItem = true;
      };

    this.saveFormSuccess = function() {
        $this.hideLoadingModal();
        if ($routeParams.action === 'create') {
          $this.showToastMessage('success', 'Create Rules', 'success');
        } else {
          $this.showToastMessage('success', 'Edit Rules', 'success');
        }

        $location.path('receipt-rules');
      };
      
    this.showToastMessage = function(className, type, message) {
          messageService.display(className, message, type);
        };

    this.saveFormFailure = function(dataFromAPI) {
          $this.hideLoadingModal();
          $scope.displayError = true;
          $scope.errorResponse = angular.copy(dataFromAPI);
        };

    this.createReceiptRule = function() {
      $this.showLoadingModal('Creating Receipt Rules Data');
      $this.formatMultiSelectedValues();
      payload = { 
        receiptRules: {
          autoPrint: $this.setString($scope.receiptRule.autoPrint),
          companyStationIds: $scope.receiptRule.companyStationId
        } 
      };
      $this.payloadGenerateReceiptFloorLimit();
      receiptsFactory.createReceiptRule(payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };
    
    this.editReceiptRule = function() {
        $this.showLoadingModal('Saving Receipt Rules Data');
        $this.formatMultiSelectedValues();
        payload = { 
            receiptRules: {
              id: $routeParams.id,
              autoPrint: $this.setString($scope.receiptRule.autoPrint),
              companyStationIds: $scope.receiptRule.companyStationId
            } 
          };
        $this.payloadGenerateReceiptFloorLimit();
        receiptsFactory.updateReceiptRule(payload).then(
          $this.saveFormSuccess,
          $this.saveFormFailure
        );
      };
    
    this.formatMultiSelectedValues = function() {
      $this.addSearchValuesFromMultiSelectArray('companyStationId', $scope.multiSelectedValues.globalStationList, 'id');
    };
  
    this.addSearchValuesFromMultiSelectArray = function(searchKeyName, multiSelectArray, multiSelectElementKey) {
      if (!multiSelectArray || multiSelectArray.length <= 0) {
        return;
      }

      var multiArray = [];
      angular.forEach(multiSelectArray, function(element) {
        multiArray.push(element[multiSelectElementKey]);
      });

      $scope.receiptRule[searchKeyName] = multiArray;
    };
    
    this.payloadGenerateReceiptFloorLimit  = function() {
      payload.receiptRules.receiptRuleLimits = $scope.receiptFloorLimitAmountsUi.map(function (receiptFloorLimitData) {
          var receiptFloorLimit = {};
          receiptFloorLimit.floorLimitAmount = receiptFloorLimitData.amount;
          receiptFloorLimit.operatingCompanyCurrencyId = $this.setString(receiptFloorLimitData.companyCurrencyId);
          if (angular.isDefined(receiptFloorLimitData.id)) {
            receiptFloorLimit.id = receiptFloorLimitData.id;
            receiptFloorLimit.companyReceiptRuleId = payload.receiptRules.id;
            receiptFloorLimit.operatingCompanyCurrencyId = receiptFloorLimitData.operatingCompanyCurrencyId;
          }
          
          return receiptFloorLimit;
        });

    };    

    this.getCountireSuccess = function(response) {
      $scope.countriesList = angular.copy(response.countries);
    };
          
    this.getCompanyGlobalStationSuccess = function(response) {
      $scope.globalStationList = angular.copy(response.response);
    };
            
    this.getCompanyCurrencyGlobalSuccess = function(response) {
      $scope.globalCompanyCurrecnyList = angular.copy(response.response);
      angular.forEach(response.response, function (currency) {
          $scope.receiptFloorLimitAmountsUi.push({
            companyCurrencyId: currency.id,
            code: currency.code,
            amount: null
          });
        });
    };
    
    this.getOnLoadingPayload = function() {
        var onLoadPayload = lodash.assign(angular.copy($scope.search), {
              startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
            });
        return onLoadPayload;
      };
      
    this.getReceiptRuleSuccess = function(response) {
      $scope.receiptRule = angular.copy(response);
      $scope.receiptRule.countryId = getCountryFromStationId(response.companyStationId);
      $scope.receiptFloorLimitAmountsUi = addCurrencyCodeToArrayItems($scope.receiptFloorLimitAmountsUi, response.receiptRuleLimits);
      getSelectedCountriesStation($scope.receiptRule.countryId);
      $scope.multiSelectedValues.globalStationList = $filter('filter')($scope.globalStationList, {
          id: response.companyStationId
        }, true);
    };
    
    function getSelectedCountriesStation(stationId) {
      var payload = {
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker()),
        countryId: stationId
      };
      receiptsFactory.getCompanyGlobalStationList(payload).then($this.getCompanyGlobalStationSuccess);
    }
    
    function getCountryFromStationId(stationId) {
        var stationList = $filter('filter')($scope.globalStationList, {
          id: stationId
        }, true);
        if (!stationList || !stationList.length) {
          return null;
        }

        return stationList[0].countryId;
      }
    
    function getCurrencyCodeFromCurrencyId(companyCurrencyId) {
        var currency = $filter('filter')($scope.globalCompanyCurrecnyList, {
          id: companyCurrencyId
        }, true);
        if (!currency || !currency.length) {
          return null;
        }

        return currency[0].code;
      }

    function addCurrencyCodeToArrayItems(orinArray, apiArray) {
        if (!apiArray || !apiArray.length) {
          return orinArray;
        }

        return apiArray.map(function (item) {
          item.code = getCurrencyCodeFromCurrencyId(parseInt(item.operatingCompanyCurrencyId));
          item.amount = item.floorLimitAmount;
          return item;
        });
      }
      
    this.validateForm = function() {
        return $scope.receiptRuleFormData.$valid;
      };
      
    this.setString = function(data) {
        if (!data) {
          return null;
        } else if (angular.isDefined(data)) {
          return data.toString();
        }
      };
      
    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        receiptsFactory.getReceiptRule($routeParams.id).then($this.getReceiptRuleSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
    };
        
    this.makeInitPromises = function() {
        var payload = {
                isOperatedCurrency: true,
                startDate: dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker())
              };
        var promises = [
          receiptsFactory.getCountriesList().then($this.getCountireSuccess),
          receiptsFactory.getCompanyGlobalStationList().then($this.getCompanyGlobalStationSuccess),
          receiptsFactory.getCompanyCurrencyGlobal(payload).then($this.getCompanyCurrencyGlobalSuccess)
        ];

        return promises;
      };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.displayError = false;
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();
  });
