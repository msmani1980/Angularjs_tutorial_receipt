'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionsService
 * @description
 * # promotionsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('promotionsService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/rsvr/api/promotions/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getPromotion: {
        method: 'GET'
      },
      getPromotions: {
        method: 'GET'
      },
      createPromotion: {
        method: 'POST'
      },
      savePromotion: {
        method: 'PUT'
      },
      deletePromotion: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPromotion(id) {
      return requestResource.getPromotion({ id: id }).$promise;
    }

    function getPromotions(payload) {
      return requestResource.getPromotions(payload).$promise;
    }

    function createPromotion(payload) {
      return requestResource.createPromotion(payload).$promise;
    }

    function savePromotion(id, payload) {
      return requestResource.savePromotion({ id: id }, payload).$promise;
    }

    function deletePromotion(id) {
      return requestResource.deletePromotion({ id: id }).$promise;
    }

    return {
      getPromotion: getPromotion,
      getPromotions: getPromotions,
      createPromotion: createPromotion,
      savePromotion: savePromotion,
      deletePromotion: deletePromotion
    };

  });
