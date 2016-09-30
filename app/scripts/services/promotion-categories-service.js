'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionCategoriesService
 * @description
 * # promotionCategoriesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('promotionCategoriesService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/promotion-categories/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getPromotionCategories: {
        method: 'GET'
      },
      createPromotionCategory: {
        method: 'POST'
      },
      updatePromotionCategory: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPromotionCategories(payload) {
      requestParameters.id = '';
      return requestResource.getPromotionCategories(payload).$promise;
    }

    function getPromotionCategory(promotionCategoryId) {
      requestParameters.id = promotionCategoryId;
      return requestResource.getPromotionCategories({}).$promise;
    }

    function createPromotionCategory(payload) {
      requestParameters.id = '';
      return requestResource.createPromotionCategory(payload).$promise;
    }

    function updatePromotionCategory(promotionCategoryId, payload) {
      requestParameters.id = promotionCategoryId;
      return requestResource.updatePromotionCategory(payload).$promise;
    }

    return {
      getPromotionCategories: getPromotionCategories,
      getPromotionCategory: getPromotionCategory,
      createPromotionCategory: createPromotionCategory,
      updatePromotionCategory: updatePromotionCategory
    };
  });
