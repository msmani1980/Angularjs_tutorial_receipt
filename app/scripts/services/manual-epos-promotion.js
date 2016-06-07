'use strict';

/**
 * @ngdoc service
 * @name ts5App.manualEposPromotion
 * @description
 * # manualEposPromotion
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('manualEposPromotion', function ($resource, ENV) {

    var manualEposPromotionListRequestURL = ENV.apiUrl + '/rsvr/api/cashbag-promotions/';
    var manualEposPromotionRequestURL = ENV.apiUrl + '/rsvr/api/cashbag-promotions/:id';

    var manualEposPromotionListRequestParams = {
      cashbagId: '@id'
    };

    var manualEposPromotionRequestParams = {
      id: '@id'
    };

    var actions = {
      getManualEposPromotionList: {
        method: 'GET'
      },
      updateCashbagPromotion: {
        method: 'PUT'
      },
      deleteManualEposPromotion: {
        method: 'DELETE'
      },
      createManualEposPromotion: {
        method: 'POST'
      }
    };

    var manualEposPromotionListRequestResource = $resource(manualEposPromotionListRequestURL, manualEposPromotionListRequestParams, actions);
    var manualEposPromotionRequestResource = $resource(manualEposPromotionRequestURL, manualEposPromotionRequestParams, actions);

    function getManualEposPromotionList(cashBagId) {
      return manualEposPromotionListRequestResource.getManualEposPromotionList({ cashbagId: cashBagId }).$promise;
    }

    function updateManualEposPromotion (id, payload) {
      return manualEposPromotionRequestResource.updateCashbagPromotion({ id: id }, payload).$promise;
    }

    function deleteManualEposPromotion(promotionId) {
      return manualEposPromotionRequestResource.deleteManualEposPromotion(promotionId).$promise;
    }

    function createManualEposPromotion(payload) {
      return manualEposPromotionRequestResource.createManualEposPromotion(payload).$promise;
    }

    return {
      createManualEposPromotion: createManualEposPromotion,
      deleteManualEposPromotion: deleteManualEposPromotion,
      updateManualEposPromotion: updateManualEposPromotion,
      getManualEposPromotionList: getManualEposPromotionList
    };
  });
