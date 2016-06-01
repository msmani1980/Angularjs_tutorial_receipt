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
    var movePostTripRequestURL = ENV.apiUrl + '/api/cash-bags/:cashBagId/to/:toCashBagId/posttrip/:postTripId';
    var postTripRequestURL = ENV.apiUrl + '/api/cash-bags/:cashBagId/posttrip/:postTripId';
    var editPostTripScheduleRequestURL = ENV.apiUrl + '/api/cash-bags/:cashBagId/edit/:postTripId/schedule/:scheduleNumber';

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

    var editPostTripScheduleRequestParameters = {
      cashBagId: '@cashBagId',
      postTripId: '@postTripId',
      scheduleNumber: '@scheduleNumber'
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
      }
    };

    var movePostTripRequestResource = $resource(movePostTripRequestURL, movePostTripRequestParameters, actions);
    var getPostTripRequestResource = $resource(postTripRequestURL, getPostTripRequestParameters, actions);
    var postTripRequestResource = $resource(postTripRequestURL, postTripRequestParameters, actions);
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

    var editPostTrip = function (cashBagId, postTripId, scheduleNumber) {
      var payload = {
        cashBagId: cashBagId,
        postTripId: postTripId,
        scheduleNumber: scheduleNumber
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

    return {
      movePostTrip: movePostTrip,
      getPostTrips: getPostTrips,
      addPostTrip: addPostTrip,
      editPostTrip: editPostTrip,
      deletePostTrip: deletePostTrip
    };
  });
