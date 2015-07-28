'use strict';

/**
 * @ngdoc service
 * @name ts5App.cashBagService
 * @description
 * # cashBagService
 * Service in the ts5App.
 */

angular.module('ts5App')
  .service('postTripService', function ($resource, $http, ENV, dateUtility, Upload) {

    function formatDateRequest(date) {
      if(date) {
        return dateUtility.formatDateForAPI(date);
      }
      return date;
    }

    function formatStationIdRequest(stationId) {
      if(stationId) {
        return stationId.toString();
      }
      return stationId;
    }

    function formatStationIdResponse(stationId) {
      if(stationId) {
        return parseInt(stationId, 10);
      }
      return stationId;
    }

    function formatTimeResponse(time) {
      if(time) {
        return dateUtility.formatDate(time, 'HH:mm:ss', 'HH:mm');
      }
      return time;
    }

    function formatToUpperCase(number) {
      if(number) {
        return number.toString().toUpperCase();
      }
      return number;
    }

    function transformRequest(data, shouldTransformForGETRequest) {
      if(!data) {
        return data;
      }
      data = angular.fromJson(data);
      data.scheduleDate = formatDateRequest(data.scheduleDate);
      data.scheduleStartDate = formatDateRequest(data.scheduleStartDate);
      data.scheduleEndDate = formatDateRequest(data.scheduleEndDate);
      data.depStationId = formatStationIdRequest(data.depStationId);
      data.arrStationId = formatStationIdRequest(data.arrStationId);
      data.scheduleNumber = formatToUpperCase(data.scheduleNumber);

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
      data.arrTime = formatTimeResponse(data.arrTime);
      data.depTime = formatTimeResponse(data.depTime);
      data.scheduleNumber = formatToUpperCase(data.scheduleNumber);
      data.depStationId = formatStationIdResponse(data.depStationId);
      data.arrStationId = formatStationIdResponse(data.arrStationId);

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
