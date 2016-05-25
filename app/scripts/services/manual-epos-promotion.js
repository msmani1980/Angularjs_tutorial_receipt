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

    var manualEposPromotionRequestURL = ENV.apiUrl + '/rsvr/api/cashbag-promotions';

    var manualEposPromotionRequestParams = {
      cashbagId: '@id'
    };

    var actions = {
      getManualEposPromotionList: {
        method: 'GET'
      },
      updateManualEposPromotion: {
        method: 'PUT'
      },
      deleteManualEposPromotion: {
        method: 'DELETE'
      },
      createManualEposPromotion: {
        method: 'POST'
      }
    };

    var manualEposPromotionRequestResource = $resource(manualEposPromotionRequestURL, manualEposPromotionRequestParams, actions);

    function getManualEposPromotionList(cashBagId) {
      return manualEposPromotionRequestResource.getManualEposPromotionList({ cashbagId: cashBagId }).$promise;
    }

    function updateManualEposPromotion(cashBagId, promotionId, payload) {
      return manualEposPromotionRequestResource.updateManualEposPromotion({ cashBagId: cashBagId }, promotionId, payload).$promise;
    }

    function deleteManualEposPromotion(promotionId) {
      return manualEposPromotionRequestResource.deleteCashBag(promotionId).$promise;
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
