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
                                          promotionCategoriesService, promotionsService, dateUtility) {

    var today = dateUtility.nowFormatted('YYYYMMDD');

    function getMasterItems(searchParams){
      return itemsService.getItemsList(searchParams, true);
    }

    function getBenefitTypes(){
      return recordsService.getBenefitTypes();
    }

    function getDiscountTypes(){
      return recordsService.getDiscountTypes();
    }

    function getCompanyId(){
      return GlobalMenuService.company.get();
    }

    function getPromotionTypes(){
      return recordsService.getPromotionTypes();
    }

    function getCompanyDiscountsCoupon(){
      return companyDiscountService.getDiscountList({
        discountTypeId: 1,
        startDate: today
      });
    }

    function getCompanyDiscountsVoucher(){
      return companyDiscountService.getDiscountList({
        discountTypeId: 4,
        startDate: today
      });
    }

    function getSalesCategories(payload){
      return salesCategoriesService.getSalesCategoriesList(payload);
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
      getCompanyId: getCompanyId,
      getPromotionTypes: getPromotionTypes,
      getCompanyDiscountsCoupon: getCompanyDiscountsCoupon,
      getCompanyDiscountsVoucher: getCompanyDiscountsVoucher,
      getSalesCategories: getSalesCategories,
      getDiscountApplyTypes: getDiscountApplyTypes,
      getPromotionCategories: getPromotionCategories,
      getStationGlobals: getStationGlobals,
      getCurrencyGlobals: getCurrencyGlobals,
      getPromotion: getPromotion,
      createPromotion: createPromotion,
      savePromotion: savePromotion
    };

  });
