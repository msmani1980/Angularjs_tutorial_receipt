'use strict';

/**
 * @ngdoc service
 * @name ts5App.cashBagService
 * @description
 * # cashBagService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('postTripsService', function ($resource, $http, ENV, dateUtility) {

    function transformRequest(data) {
      data = angular.fromJson(data);
      if(data.scheduleDate !== null) {
        data.scheduleDate = dateUtility.formatDateForAPI(data.scheduleDate);
        console.log(data.scheduleDate);
      }
      data = angular.toJson(data);
      return data;
    }
    //TODO!
    //function transformResponse(data) {
    //  data = angular.fromJson(data);
    //  if(data.scheduleDate !== null) {
    //    data.scheduleDate = dateUtility.format(data.scheduleDate, 'YYYY-MM-DD', 'MM/DD/YYYY');
    //    console.log(data.scheduleDate);
    //  }
    //  data = angular.toJson(data);
    //  return data;
    //}

    // this function is from the docs: https://docs.angularjs.org/api/ng/service/$http#overriding-the-default-transformations-per-request
    var appendTransform = function appendTransform(defaults, transform) {
      console.log('hi');
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    };

    var requestURL = ENV.apiUrl + '/api/companies/:id/posttrips/:tripid';
    var requestParameters = {
      id: '@id',
      tripid:'@tripid'
    };
    var actions = {
      getPostTrips: {
        method: 'GET',
        headers: {companyId: 362}
      },
      getPostTrip: {
        method: 'GET',
        headers: {companyId: 362}
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
        headers: {companyId: 362}
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPostTrips(companyId, optionalPayload) {
      var payload = {};
      if (arguments.length === 2) {
        payload = optionalPayload;
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

    function updatePostTrip(companyId, payload){
      requestParameters.id = companyId;
      return requestResource.updatePostTrip(payload).$promise;
    }

    function deletePostTrip(companyId, postTripId){
      requestParameters.id = companyId;
      requestParameters.tripid = postTripId;
      return requestResource.deletePostTrip().$promise;
    }

    function createPostTrip(companyId, payload) {
      requestParameters.id = companyId;
      return requestResource.createPostTrips(companyId, payload).$promise;
    }

    return {
      getPostTrips: getPostTrips,
      getPostTrip: getPostTrip,
      updatePostTrip: updatePostTrip,
      deletePostTrip: deletePostTrip,
      createPostTrip: createPostTrip
    };
  });
