'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionsFactory
 * @description
 * # promotionsFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('promotionsFactory', function (itemsService, recordsService, GlobalMenuService, stationsService,
                                          companyDiscountService, salesCategoriesService, currenciesService,
                                          promotionCategoriesService, promotionsService) {

    function getMasterItems(searchParams){
      return itemsService.getItemsList(searchParams, true);
    }

    function getBenefitTypes(){
      return recordsService.getBenefitTypes();
    }

    function getDiscountTypes(){
      return recordsService.getDiscountTypes();
    }

    function getStationList(companyId){
      return stationsService.getStationList(companyId);
    }

    function getCompanyId(){
      return GlobalMenuService.company.get();
    }

    function getPromotionTypes(){
      return recordsService.getPromotionTypes();
    }

    function getCompanyDiscounts(payload){
      return companyDiscountService.getDiscountList(payload);
    }

    function getSalesCategories(payload){
      return salesCategoriesService.getSalesCategoriesList(payload);
    }

    function getCompanyGlobalCurrencies(payload){
      return currenciesService.getCompanyGlobalCurrencies(payload);
    }

    function getDiscountApplyTypes(){
      return recordsService.getDiscountApplyTypes();
    }

    function getPromotionCategories(){
      return promotionCategoriesService.getPromotionCategories();
    }

    function getStationGlobals(payload){
      return stationsService.getGlobalStationList(payload);
    }

    function getCurrencyGlobals(payload){
      return currenciesService.getCompanyCurrencies(payload);
    }

    function getPromotion(id){
      return promotionsService.getPromotion(id);
    }

    function createPromotion(payload){
      return promotionsService.createPromotion(payload);
    }

    function savePromotion(id, payload){
      return promotionsService.savePromotion(id, payload);
    }

    return {
      getMasterItems: getMasterItems,
      getBenefitTypes: getBenefitTypes,
      getDiscountTypes: getDiscountTypes,
      getStationList: getStationList,
      getCompanyId: getCompanyId,
      getPromotionTypes: getPromotionTypes,
      getCompanyDiscounts: getCompanyDiscounts,
      getSalesCategories: getSalesCategories,
      getCompanyGlobalCurrencies: getCompanyGlobalCurrencies,
      getDiscountApplyTypes: getDiscountApplyTypes,
      getPromotionCategories: getPromotionCategories,
      getStationGlobals: getStationGlobals,
      getCurrencyGlobals: getCurrencyGlobals,
      getPromotion: getPromotion,
      createPromotion: createPromotion,
      savePromotion: savePromotion
    };

  });
