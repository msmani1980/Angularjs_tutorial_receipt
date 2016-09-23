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

    return {
      getPromotionCategories: getPromotionCategories,
      getPromotionCategory: getPromotionCategory
    };
  });
