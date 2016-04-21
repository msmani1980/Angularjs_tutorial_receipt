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
    var postTripRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:cashBagId/posttrip/:postTripId';

    var movePostTripRequestParameters = {
      cashBagId: '@cashBagId',
      toCashBagId: '@toCashBagId',
      postTripId: '@postTripId'
    };

    var getPostTripRequestParameters = {
      cashBagId: '@cashBagId'
    };

    var addPostTripRequestParameters = {
      cashBagId: '@cashBagId',
      postTripId: '@postTripId'
    };

    var actions = {
      movePostTrip: {
        method: 'PUT'
      },
      getPostTrip: {
        method: 'GET'
      },
      addPostTrip: {
        method: 'POST'
      },
      editPostTrip: {
        method: 'PUT'
      },
      deletePostTrip: {
        method: 'DELETE'
      }
    };

    var movePostTripRequestResource = $resource(movePostTripRequestURL, movePostTripRequestParameters, actions);
    var getPostTripRequestResource = $resource(postTripRequestURL, getPostTripRequestParameters, actions);
    var postTripRequestResource = $resource(postTripRequestURL, addPostTripRequestParameters, actions);

    var getPostTrips = function (cashBagId) {
      var payload = {
        cashBagId: cashBagId
      };

      return getPostTripRequestResource.getPostTrip(payload).$promise;
    };

    var movePostTrip = function (originCashBagId, targetCashBagId, postTripId) {
      var payload = {
        cashBagId: originCashBagId,
        toCashBagId: targetCashBagId,
        postTripId: postTripId
      };

      return movePostTripRequestResource.movePostTrip(payload).$promise;
    };

    var addPostTrip = function (cashBagId, postTripId) {
      var payload = {
        cashBagId: cashBagId,
        postTripId: postTripId
      };

      return postTripRequestResource.addPostTrip(payload).$promise;
    };

    var editPostTrip = function (cashBagId, postTripId, scheduleNumber) {
      var payload = {
        cashBagId: cashBagId,
        postTripId: postTripId,
        scheduleNumber: scheduleNumber
      };

      return postTripRequestResource.editPostTrip(payload).$promise;
    };

    var deletePostTrip = function (cashBagId, postTripId) {
      var payload = {
        cashBagId: cashBagId,
        postTripId: postTripId
      };

      return postTripRequestResource.deletePostTrip(payload).$promise;
    };

    return {
      movePostTrip: movePostTrip,
      getPostTrips: getPostTrips,
      addPostTrip: addPostTrip,
      editPostTrip: editPostTrip,
      deletePostTrip: deletePostTrip
    };
  });
