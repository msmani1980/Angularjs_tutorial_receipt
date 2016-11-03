'use strict';

/**
 * @ngdoc service
 * @name ts5App.promotionCatalogService
 * @description
 * # promotionCatelogService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('promotionCatalogService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/company-promotion-catalogs/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getPromotionCatalog: {
        method: 'GET'
      },
      createPromotionCatalog: {
        method: 'POST'
      },
      updatePromotionCatalog: {
        method: 'PUT'
      },
      deletePromotionCatalog: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPromotionCatalogList(payload) {
      requestParameters.id = '';
      return requestResource.getPromotionCatalog(payload).$promise;
    }

    function getPromotionCatalog(promotionCatalogId) {
      requestParameters.id = promotionCatalogId;
      return requestResource.getPromotionCatalog({}).$promise;
    }

    function createPromotionCatalog(payload) {
      requestParameters.id = '';
      return requestResource.createPromotionCatalog(payload).$promise;
    }

    function updatePromotionCatalog(promotionCatalogId, payload) {
      requestParameters.id = promotionCatalogId;
      return requestResource.updatePromotionCatalog(payload).$promise;
    }

    function deletePromotionCatalog(promotionCatalogId) {
      requestParameters.id = promotionCatalogId;
      return requestResource.deletePromotionCatalog({}).$promise;
    }

    return {
      getPromotionCatalogList: getPromotionCatalogList,
      getPromotionCatalog: getPromotionCatalog,
      createPromotionCatalog: createPromotionCatalog,
      updatePromotionCatalog: updatePromotionCatalog,
      deletePromotionCatalog: deletePromotionCatalog
    };
  });
