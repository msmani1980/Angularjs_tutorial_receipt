'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceAmendService
 * @description
 * # storeInstanceAmendService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceAmendService', function (ENV, $resource) {
    var movePostTripFromEposCashBagRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:cashBagId/to/:toCashBagId/posttrip/:postTripId';
    var movePostTripFromManualCashBagRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:cashBagId/to/:toCashBagId/mcbposttrip/:postTripId';

    var movePostTripRequestParameters = {
      cashBagId: '@cashBagId',
      toCashBagId: '@toCashBagId',
      postTripId: '@postTripId'
    };

    var actions = {
      movePostTripRequestURL: {
        method: 'PUT'
      }
    };

    var movePostTripFromEposCashBagRequestResource = $resource(movePostTripFromEposCashBagRequestURL, movePostTripRequestParameters, actions);
    var movePostTripFromManualCashBagRequestResource = $resource(movePostTripFromManualCashBagRequestURL, movePostTripRequestParameters, actions);

    var movePostTripFromManualCashBag = function (originCashBagId, targetCashBagId, postTripId) {
      var payload = {
        cashBagId: originCashBagId,
        toCashBagId: targetCashBagId,
        postTripId: postTripId
      };

      return movePostTripFromManualCashBagRequestResource.movePostTripRequestURL(payload).$promise;
    };

    var movePostTripFromEposCashBag = function (originCashBagId, targetCashBagId, postTripId) {
      var payload = {
        cashBagId: originCashBagId,
        toCashBagId: targetCashBagId,
        postTripId: postTripId
      };

      return movePostTripFromEposCashBagRequestResource.movePostTripRequestURL(payload).$promise;
    };

    return {
      movePostTripFromManualCashBag: movePostTripFromManualCashBag,
      movePostTripFromEposCashBag: movePostTripFromEposCashBag
    };
  });
