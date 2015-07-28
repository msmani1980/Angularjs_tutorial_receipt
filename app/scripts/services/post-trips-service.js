'use strict';
/*global moment*/

/**
 * @ngdoc service
 * @name ts5App.cashBagService
 * @description
 * # cashBagService
 * Service in the ts5App.
 */
// jshint maxcomplexity:10

angular.module('ts5App')
  .service('postTripService', function ($resource, $http, ENV, dateUtility, Upload) {

    function transformRequest(data, shouldTransformForGETRequest) {
      data = angular.fromJson(data);
      if (data && data.scheduleDate) {
        data.scheduleDate = dateUtility.formatDateForAPI(data.scheduleDate);
      }
      if (data && data.scheduleStartDate) {
        data.scheduleStartDate = dateUtility.formatDateForAPI(data.scheduleStartDate);
      }
      if (data && data.scheduleEndDate) {
        data.scheduleEndDate = dateUtility.formatDateForAPI(data.scheduleEndDate);
      }
      if (data && data.scheduleNumber) {
        data.scheduleNumber = data.scheduleNumber.toString().toUpperCase();
      }
      if (data && data.depStationId) {
        data.depStationId = data.depStationId.toString();
      }
      if (data && data.arrStationId) {
        data.arrStationId = data.arrStationId.toString();
      }

      if (shouldTransformForGETRequest) {
        return data;
      }
      return angular.toJson(data);
    }

    function transformRequestForPostAndPut(data) {
      return transformRequest(data, false);
    }

    function transformResponse(data) {
      data = angular.fromJson(data);
      if (!data) {
        return data;
      }
      if (data.scheduleDate) {
        data.scheduleDate = dateUtility.formatDate(data.scheduleDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
      }
      if (data.arrTime) {
        data.arrTime = moment(data.arrTime, 'HH:mm:ss').format('HH:mm');
      }
      if (data.depTime) {
        data.depTime = moment(data.depTime, 'HH:mm:ss').format('HH:mm');
      }
      if (data && data.scheduleNumber) {
        data.scheduleNumber = data.scheduleNumber.toString().toUpperCase();
      }
      if (data && data.depStationId) {
        data.depStationId = parseInt(data.depStationId, 10);
      }
      if (data && data.arrStationId) {
        data.arrStationId = parseInt(data.arrStationId, 10);
      }
      return data;
    }

    function transformResponseArray(data) {
      data = angular.fromJson(data);
      if (!data) {
        return;
      }
      angular.forEach(data.postTrips, function (trip) {
        trip = transformResponse(trip);
      });
      return data;
    }

    // this function is from the docs: https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
    var appendTransform = function appendTransform(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    };

    var requestURL = ENV.apiUrl + '/api/companies/:id/posttrips/:tripid';
    var requestParameters = {
      id: '@id',
      tripid: '@tripid'
    };
    var actions = {
      getPostTrips: {
        method: 'GET',
        headers: {companyId: 362},
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponseArray)
      },
      getPostTrip: {
        method: 'GET',
        headers: {companyId: 362},
        transformResponse: appendTransform($http.defaults.transformResponse, transformResponse)
      },
      updatePostTrip: {
        method: 'PUT',
        headers: {companyId: 362},
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequestForPostAndPut)
      },
      deletePostTrip: {
        method: 'DELETE',
        headers: {companyId: 362}
      },
      createPostTrips: {
        method: 'POST',
        headers: {companyId: 362},
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequestForPostAndPut)
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPostTrips(companyId, optionalPayload) {
      requestParameters.tripid = '';
      var payload = {};
      if (arguments.length === 2) {
        // TODO: encode colon in time query parameter -- or wait for backend to fix
        payload = transformRequest(optionalPayload, true);
      }
      requestParameters.id = companyId;
      return requestResource.getPostTrips(payload).$promise;
    }

    function getPostTrip(companyId, postTripId) {
      requestParameters.id = companyId;
      requestParameters.tripid = postTripId;
      return requestResource.getPostTrip({}).$promise;
    }

    function updatePostTrip(companyId, payload) {
      requestParameters.id = companyId;
      requestParameters.tripid = payload.id;
      return requestResource.updatePostTrip(payload).$promise;
    }

    function deletePostTrip(companyId, postTripId) {
      requestParameters.id = companyId;
      requestParameters.tripid = postTripId;
      return requestResource.deletePostTrip().$promise;
    }

    function createPostTrip(companyId, payload) {
      requestParameters.id = companyId;
      return requestResource.createPostTrips(companyId, payload).$promise;
    }

    function importFromExcel(companyId, file) {
      var uploadRequestURL = ENV.apiUrl + '/services/companies/' + companyId + '/file/posttrip';
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      });
    }

    return {
      getPostTrips: getPostTrips,
      getPostTrip: getPostTrip,
      updatePostTrip: updatePostTrip,
      deletePostTrip: deletePostTrip,
      createPostTrip: createPostTrip,
      importFromExcel: importFromExcel
    };
  });
