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
    var requestURL = ENV.apiUrl + '/api/promotion-categories';
    var actions = {
      getPromotionCategories: {
        method: 'GET'
      }
    };
    var requestResource = $resource(requestURL, null, actions);

    function getPromotionCategories() {
      return requestResource.getPromotionCategories().$promise;
    }

    return {
      getPromotionCategories: getPromotionCategories
    };
  });
