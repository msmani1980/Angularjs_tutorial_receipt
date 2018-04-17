'use strict';

/**
 * @ngdoc service
 * @name ts5App.priceupdaterFactory
 * @description
 * # priceupdaterFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('priceupdaterFactory', function (globalMenuService, priceupdaterService, salesCategoriesService, priceTypesService) {

    var getCompanyId = function () {
      return globalMenuService.company.get();
    };

    var getPriceUpdaterRules = function (payload) {
      return priceupdaterService.getPriceUpdaterRules(payload);
    };

    var getPriceUpdaterRule = function(ruleId) {
      return priceupdaterService.getPriceUpdaterRuleById(ruleId);
    };
    
    var createPriceUpdaterRule = function (payload) {
      return priceupdaterService.createPriceUpdaterRule(payload);
    };
    
    var updatePriceUpdaterRule = function (payload) {
      return priceupdaterService.updatePriceUpdaterRule(payload.id, payload);
    };
    
    var deletePriceUpdaterRule = function (ruleId) {
      return priceupdaterService.deletePriceUpdaterRule(ruleId);
    };

    var getSalesCategoriesList = function (payload) {
      return salesCategoriesService.getSalesCategoriesList(payload);
    };

    var getPriceTypesList = function (payload) {
      return priceTypesService.getPriceTypesList(payload);
    };
    
    return {
      getPriceUpdaterRules: getPriceUpdaterRules,
      getPriceUpdaterRule: getPriceUpdaterRule,
      createPriceUpdaterRule: createPriceUpdaterRule,
      updatePriceUpdaterRule: updatePriceUpdaterRule,
      deletePriceUpdaterRule: deletePriceUpdaterRule,
      getCompanyId: getCompanyId,
      getSalesCategoriesList: getSalesCategoriesList,
      getPriceTypesList: getPriceTypesList
    };
	
  });
