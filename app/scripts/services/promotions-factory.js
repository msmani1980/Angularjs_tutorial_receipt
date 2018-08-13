'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionsFactory
 * @description
 * # promotionsFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('promotionsFactory', function (itemsService, recordsService, globalMenuService, stationsService,
                                          companyDiscountService, salesCategoriesService, currenciesService,
                                          promotionCategoriesService, promotionsService) {

    function getMasterItems(searchParams) {
      return itemsService.getItemsList(searchParams, true);
    }

    function getMasterItem(id) {
      return itemsService.getMasterItem(id);
    }

    function getBenefitTypes() {
      return recordsService.getBenefitTypes();
    }

    function getDiscountTypes() {
      return recordsService.getDiscountTypes();
    }

    function getCompanyId() {
      return globalMenuService.company.get();
    }

    function getPromotionTypes() {
      return recordsService.getPromotionTypes();
    }

    function getCompanyDiscountsCoupon(datesPayload) {
      var payload = angular.extend({
        discountTypeId: 1
      }, datesPayload);
      return companyDiscountService.getDiscountList(payload);
    }

    function getCompanyDiscountsVoucher(datesPayload) {
      var payload = angular.extend({
        discountTypeId: 4
      }, datesPayload);
      return companyDiscountService.getDiscountList(payload);
    }

    function getSalesCategories(payload) {
      return salesCategoriesService.getSalesCategoriesList(payload);
    }

    function getDiscountApplyTypes() {
      return recordsService.getDiscountApplyTypes();
    }

    function getPromotionCategories() {
      return promotionCategoriesService.getPromotionCategories();
    }

    function getActivePromotionCategories(datesPayload) {
      return promotionCategoriesService.getPromotionCategories(datesPayload);
    }

    function getStationGlobals(payload) {
      return stationsService.getGlobalStationList(payload);
    }

    function getCurrencyGlobals(payload) {
      return currenciesService.getCompanyCurrencies(payload);
    }

    function getPromotion(id) {
      return promotionsService.getPromotion(id);
    }

    function getPromotions(payload) {
      return promotionsService.getPromotions(payload);
    }

    function createPromotion(payload) {
      return promotionsService.createPromotion(payload);
    }

    function savePromotion(id, payload) {
      return promotionsService.savePromotion(id, payload);
    }

    function deletePromotion(id) {
      return promotionsService.deletePromotion(id);
    }

    return {
      getMasterItems: getMasterItems,
      getMasterItem: getMasterItem,
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
      getPromotions: getPromotions,
      createPromotion: createPromotion,
      savePromotion: savePromotion,
      deletePromotion: deletePromotion,
      getActivePromotionCategories: getActivePromotionCategories
    };

  });
