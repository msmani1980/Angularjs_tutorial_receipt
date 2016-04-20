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
    var movePostTripRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:cashBagId/to/:toCashBagId/posttrip/:postTripId';

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

    var movePostTripRequestResource = $resource(movePostTripRequestURL, movePostTripRequestParameters, actions);

    var movePostTrip = function (originCashBagId, targetCashBagId, postTripId) {
      var payload = {
        cashBagId: originCashBagId,
        toCashBagId: targetCashBagId,
        postTripId: postTripId
      };

      return movePostTripRequestResource.movePostTripRequestURL(payload).$promise;
    };

    return {
      movePostTrip: movePostTrip
    };
  });
