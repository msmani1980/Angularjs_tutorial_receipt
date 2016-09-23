'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionCategoryFactory
 * @description
 * # promotionCategoryFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('promotionCategoryFactory', function (promotionCategoriesService, itemsService, categoryService) {

    function getCategoryList(optionalPayload) {
      var payload = optionalPayload || {};
      return categoryService.getCategoryList(payload);
    }

    function getMasterItemList(optionalPayload) {
      var payload = optionalPayload || {};
      return categoryService.getItemsList(payload, true);
    }

    function getPromotionCategoryList(optionalPayload) {
      var payload = optionalPayload || {};
      return promotionCategoriesService.getPromotionCategoryList(payload);
    }

    function getPromotionCategory(promotionCategoryId) {
      return promotionCategoriesService.getPromotionCategory(promotionCategoryId);
    }

    return {
      getCategoryList: getCategoryList,
      getMasterItemList: getMasterItemList,
      getPromotionCategoryList: getPromotionCategoryList,
      getPromotionCategory: getPromotionCategory
    };

  });
