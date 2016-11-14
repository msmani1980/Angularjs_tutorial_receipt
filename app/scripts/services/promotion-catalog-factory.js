'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionCatalogFactory
 * @description
 * # promotionCatalogFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('promotionCatalogFactory', function (promotionCatalogService, promotionsService) {

    //function getCompanyId() {
    //  return globalMenuService.getCompanyData().id;
    //}
    //
    //function getCategoryList(optionalPayload) {
    //  var payload = optionalPayload || {};
    //  payload.companyId = getCompanyId();
    //
    //  return categoryService.getCategoryList(payload);
    //}

    //function getMasterItemList(optionalPayload) {
    //  var payload = optionalPayload || {};
    //  return itemsService.getItemsList(payload, true);
    //}

    function getPromotionCatalogList(optionalPayload) {
      var payload = optionalPayload || {};
      return promotionCatalogService.getPromotionCatalogList(payload);
    }

    function getPromotionCatalog(promotionCatalogId) {
      return promotionCatalogService.getPromotionCatalog(promotionCatalogId);
    }

    function createPromotionCatalog(payload) {
      return promotionCatalogService.createPromotionCatalog(payload);
    }

    function updatePromotionCatalog(promotionCatalogId, payload) {
      return promotionCatalogService.updatePromotionCatalog(promotionCatalogId, payload);
    }

    function deletePromotionCatalog(promotionCatalogId) {
      return promotionCatalogService.deletePromotionCatalog(promotionCatalogId);
    }

    function getPromotionList(payload) {
      return promotionsService.getPromotions(payload);
    }

    return {
      getPromotionCatalogList: getPromotionCatalogList,
      getPromotionCatalog: getPromotionCatalog,
      createPromotionCatalog: createPromotionCatalog,
      updatePromotionCatalog: updatePromotionCatalog,
      deletePromotionCatalog: deletePromotionCatalog,
      getPromotionList: getPromotionList
    };

  });
