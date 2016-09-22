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
    var requestURL = ENV.apiUrl + '/rsvr/api/promotion-categories';
    var requestParameters = {};
    var actions = {
      getPromotionCategories: {
        method: 'GET'
      }
    };
    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPromotionCategories(optionalPayload) {
      var payload = optionalPayload || {};
      return requestResource.getPromotionCategories(payload).$promise;
    }

    return {
      getPromotionCategories: getPromotionCategories
    };
  });
