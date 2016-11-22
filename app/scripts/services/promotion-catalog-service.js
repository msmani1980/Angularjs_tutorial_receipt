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
    var promotionCatalogRequestURL = ENV.apiUrl + '/rsvr/api/company-promotion-catalogs/:id';
    var catalogConjunctionRequestURL = ENV.apiUrl + '/rsvr/api/promotion-catalog-conjunctions/:id';
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
      },
      getCatalogConjunction: {
        method: 'GET'
      },
      createCatalogConjunction: {
        method: 'POST'
      },
      updateCatalogConjunction: {
        method: 'PUT'
      },
      deleteCatalogConjunction: {
        method: 'DELETE'
      }
    };

    var promotionCatalogRequestResource = $resource(promotionCatalogRequestURL, requestParameters, actions);
    var catalogConjunctionRequestResource = $resource(catalogConjunctionRequestURL, requestParameters, actions);

    function getPromotionCatalogList(payload) {
      requestParameters.id = '';
      return promotionCatalogRequestResource.getPromotionCatalog(payload).$promise;
    }

    function getPromotionCatalog(promotionCatalogId) {
      requestParameters.id = promotionCatalogId;
      return promotionCatalogRequestResource.getPromotionCatalog({}).$promise;
    }

    function createPromotionCatalog(payload) {
      requestParameters.id = '';
      return promotionCatalogRequestResource.createPromotionCatalog(payload).$promise;
    }

    function updatePromotionCatalog(promotionCatalogId, payload) {
      requestParameters.id = promotionCatalogId;
      return promotionCatalogRequestResource.updatePromotionCatalog(payload).$promise;
    }

    function deletePromotionCatalog(promotionCatalogId) {
      requestParameters.id = promotionCatalogId;
      return promotionCatalogRequestResource.deletePromotionCatalog({}).$promise;
    }

    function getPromotionCatalogConjunction(promotionCatalogId) {
      requestParameters.id = promotionCatalogId;
      return catalogConjunctionRequestResource.getCatalogConjunction({}).$promise;
    }

    function createPromotionCatalogConjunction(payload) {
      requestParameters.id = '';
      return catalogConjunctionRequestResource.createCatalogConjunction(payload).$promise;
    }

    function updatePromotionCatalogConjunction(promotionCatalogId, payload) {
      requestParameters.id = promotionCatalogId;
      return catalogConjunctionRequestResource.updateCatalogConjunction(payload).$promise;
    }

    function deletePromotionCatalogConjunction(promotionCatalogId) {
      requestParameters.id = promotionCatalogId;
      return catalogConjunctionRequestResource.deleteCatalogConjunction({}).$promise;
    }

    return {
      getPromotionCatalogList: getPromotionCatalogList,
      getPromotionCatalog: getPromotionCatalog,
      createPromotionCatalog: createPromotionCatalog,
      updatePromotionCatalog: updatePromotionCatalog,
      deletePromotionCatalog: deletePromotionCatalog,
      getPromotionCatalogConjunction: getPromotionCatalogConjunction,
      createPromotionCatalogConjunction: createPromotionCatalogConjunction,
      updatePromotionCatalogConjunction: updatePromotionCatalogConjunction,
      deletePromotionCatalogConjunction: deletePromotionCatalogConjunction
    };
  });
