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
    var temporaryPostTripRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:cashBagId/posttrip/temporary/:postTripId';
    var editPostTripScheduleRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:cashBagId/edit/:postTripId/schedule/:newPostTripId';

    var movePostTripRequestParameters = {
      cashBagId: '@cashBagId',
      toCashBagId: '@toCashBagId',
      postTripId: '@postTripId'
    };

    var getPostTripRequestParameters = {
      cashBagId: '@cashBagId'
    };

    var postTripRequestParameters = {
      cashBagId: '@cashBagId',
      postTripId: '@postTripId'
    };

    var temporaryPostTripRequestParameters = {
      cashBagId: '@cashBagId',
      postTripId: '@postTripId'
    };

    var editPostTripScheduleRequestParameters = {
      cashBagId: '@cashBagId',
      postTripId: '@postTripId',
      newPostTripId: '@newPostTripId'
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
      editPostTripSchedule: {
        method: 'PUT'
      },
      deletePostTrip: {
        method: 'DELETE'
      },
      deleteTemporaryPostTrip: {
        method: 'DELETE'
      }
    };

    var movePostTripRequestResource = $resource(movePostTripRequestURL, movePostTripRequestParameters, actions);
    var getPostTripRequestResource = $resource(postTripRequestURL, getPostTripRequestParameters, actions);
    var postTripRequestResource = $resource(postTripRequestURL, postTripRequestParameters, actions);
    var temporaryPostTripRequestResource = $resource(temporaryPostTripRequestURL, temporaryPostTripRequestParameters, actions);
    var editPostTripScheduleRequestResource = $resource(editPostTripScheduleRequestURL, editPostTripScheduleRequestParameters, actions);

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

    var editPostTrip = function (cashBagId, postTripId, newPostTripId) {
      var payload = {
        cashBagId: cashBagId,
        postTripId: postTripId,
        newPostTripId: newPostTripId
      };

      return editPostTripScheduleRequestResource.editPostTripSchedule(payload).$promise;
    };

    var deletePostTrip = function (cashBagId, postTripId) {
      var payload = {
        cashBagId: cashBagId,
        postTripId: postTripId
      };

      return postTripRequestResource.deletePostTrip(payload).$promise;
    };

    var deleteTemporaryPostTrip = function (cashBagId, postTripId) {
      var payload = {
        cashBagId: cashBagId,
        postTripId: postTripId
      };

      return temporaryPostTripRequestResource.deleteTemporaryPostTrip(payload).$promise;
    };

    return {
      movePostTrip: movePostTrip,
      getPostTrips: getPostTrips,
      addPostTrip: addPostTrip,
      editPostTrip: editPostTrip,
      deletePostTrip: deletePostTrip,
      deleteTemporaryPostTrip: deleteTemporaryPostTrip
    };
  });
