'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionCategoryFactory
 * @description
 * # promotionCategoryFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('promotionCategoryFactory', function (promotionCategoriesService, itemsService, categoryService, globalMenuService) {

    function getCompanyId() {
      return globalMenuService.getCompanyData().id;
    }

    function getCategoryList(optionalPayload) {
      var payload = optionalPayload || {};
      payload.companyId = getCompanyId();

      return categoryService.getCategoryList(payload);
    }

    function getMasterItemList(optionalPayload) {
      var payload = optionalPayload || {};
      return itemsService.getItemsList(payload, true);
    }

    function getPromotionCategoryList(optionalPayload) {
      var payload = optionalPayload || {};
      return promotionCategoriesService.getPromotionCategories(payload);
    }

    function getPromotionCategory(promotionCategoryId) {
      return promotionCategoriesService.getPromotionCategory(promotionCategoryId);
    }

    function createPromotionCategory(payload) {
      return promotionCategoriesService.createPromotionCategory(payload);
    }

    function updatePromotionCategory(promotionCategoryId, payload) {
      return promotionCategoriesService.updatePromotionCategory(promotionCategoryId, payload);
    }

    function deletePromotionCategory(promotionCategoryId) {
      return promotionCategoriesService.deletePromotionCategory(promotionCategoryId);
    }

    return {
      getCompanyId: getCompanyId,
      getCategoryList: getCategoryList,
      getMasterItemList: getMasterItemList,
      getPromotionCategoryList: getPromotionCategoryList,
      getPromotionCategory: getPromotionCategory,
      createPromotionCategory: createPromotionCategory,
      updatePromotionCategory: updatePromotionCategory,
      deletePromotionCategory: deletePromotionCategory
    };

  });
