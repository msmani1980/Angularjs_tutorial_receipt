'use strict';

/**
 * @ngdoc service
 * @name ts5App.cashBagService
 * @description
 * # cashBagService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('postTripsService', function ($resource, $http, ENV, dateUtility, Upload) {

    function transformRequest(data) {
      data = angular.fromJson(data);
      if (data !== undefined && data.scheduleDate !== null && data.scheduleDate !== undefined) {
        data.scheduleDate = dateUtility.formatDateForAPI(data.scheduleDate);
      }
      return angular.toJson(data);
    }

    function transformResponse(data) {
      data = angular.fromJson(data);
      if (!data) {
        return data;
      }
      if (data.scheduleDate !== null && data.scheduleDate !== undefined) {
        data.scheduleDate = dateUtility.formatDate(data.scheduleDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
      }
      if (data.arrTime && data.arrTime !== null) {
        data.arrTime = moment(data.arrTime, 'HH:mm:ss').format('HH:mm');
      }
      if (data.depTime && data.depTime !== null) {
        data.depTime = moment(data.depTime, 'HH:mm:ss').format('HH:mm');
      }
      return data;
    }

    function transformResponseArray(data) {
      data = angular.fromJson(data);
      if(!data) {
        return;
      }
      angular.forEach(data.postTrips, function (trip) {
        if (trip.arrTime && trip.arrTime !== null) {
          trip.arrTime = moment(trip.arrTime, 'HH:mm:ss').format('HH:mm');
        }
        if (trip.depTime && trip.depTime !== null) {
          trip.depTime = moment(trip.depTime, 'HH:mm:ss').format('HH:mm');
        }
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
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      },
      deletePostTrip: {
        method: 'DELETE',
        headers: {companyId: 362}
      },
      createPostTrips: {
        method: 'POST',
        headers: {companyId: 362},
        transformRequest: appendTransform($http.defaults.transformRequest, transformRequest)
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPostTrips(companyId, optionalPayload) {
      requestParameters.tripid = '';
      var payload = {};
      if (arguments.length === 2) {
        payload = optionalPayload;
        if (payload.scheduleDate !== undefined && payload.scheduleDate !== null) {
          payload.scheduleDate = dateUtility.formatDateForAPI(payload.scheduleDate);
        }
        // TODO: encode colon in time query parameter -- or wait for backend to fix
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

    function uploadPostTrip(companyId, file, successHandler, errorHandler) {
      var uploadRequestURL = ENV.apiUrl + '/services/companies/' + companyId + '/file/posttrip';
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      }).progress(function (evt) {
        file.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
      }).success(successHandler).error(errorHandler);
    }

    return {
      getPostTrips: getPostTrips,
      getPostTrip: getPostTrip,
      updatePostTrip: updatePostTrip,
      deletePostTrip: deletePostTrip,
      createPostTrip: createPostTrip,
      uploadPostTrip: uploadPostTrip
    };
  });
