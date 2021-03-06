'use strict';

/**
 * @ngdoc service
 * @name ts5App.receiptsFactory
 * @description
 * # receiptsFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('receiptsFactory', function (globalMenuService, stationsService, countriesService, receiptRulesService, currenciesService) {
    var getCompanyId = function () {
      return globalMenuService.company.get();
    };
  
    var getReceiptRules = function (payload) {
      return receiptRulesService.getReceiptRules(payload);
    };

    var getReceiptRule = function(receiptRuleId) {
      return receiptRulesService.getReceiptRule(receiptRuleId);
    };

    var createReceiptRule = function (payload) {
      return receiptRulesService.createReceiptRule(payload);
    };

    var updateReceiptRule = function (payload) {
      return receiptRulesService.updateReceiptRule(payload);
    };

    var deleteReceiptRule = function (receiptRuleId) {
      return receiptRulesService.deleteReceiptRule(receiptRuleId);
    };
  
    var getCompanyGlobalStationList = function (payload) {
      return stationsService.getGlobalStationList(payload);
    };

    var getCountriesList = function() {
      return countriesService.getCountriesList();
    };
    
    function getCompanyCurrencyGlobal(payload) {
      return currenciesService.getCompanyCurrencies(payload);
    }
    
    return {
      getReceiptRules: getReceiptRules,
      getReceiptRule: getReceiptRule,
      createReceiptRule: createReceiptRule,
      updateReceiptRule: updateReceiptRule,
      deleteReceiptRule: deleteReceiptRule,
      getCompanyId: getCompanyId,
      getCompanyGlobalStationList: getCompanyGlobalStationList,
      getCountriesList: getCountriesList,
      getCompanyCurrencyGlobal: getCompanyCurrencyGlobal
    };
  });
