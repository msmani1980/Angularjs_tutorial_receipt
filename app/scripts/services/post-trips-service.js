'use strict';

/**
 * @ngdoc service
 * @name ts5App.cashBagService
 * @description
 * # cashBagService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('postTripsService', function ($resource, ENV) {

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
        headers: {comanyId: 362}
      },
      updatePostTrip: {
        method: 'PUT',
        headers: {companyId: 362}
      },
      //deletePostTrips: {
      //  method: 'DELETE',
      //  headers: {companyId: 362}
      //},
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
      }
      requestParameters.id = companyId;
      return requestResource.getPostTrips(payload).$promise;
    }

    function getPostTrip(companyId, postTripId) {
      requestParameters.id = companyId;
      requestParameters.tripid = postTripId;
      return requestResource.getPostTrip({}).$promise;
    }
    //
    //function getCashBag(cashBagId) {
    //  return requestResource.getCashBag({id:cashBagId}).$promise;
    //}
    //
    function updatePostTrip(companyId, payload){
      requestParameters.id = companyId;
      return requestResource.updatePostTrip(payload).$promise;
    }
    //
    //function deleteCashBag(cashBagId){
    //  return requestResource.deleteCashBag({id:cashBagId}).$promise;
    //}
    //
    function createPostTrip(companyId, payload) {
      requestParameters.id = companyId;
      return requestResource.createPostTrips(companyId, payload).$promise;
    }

    return {
      getPostTrips: getPostTrips,
      getPostTrip: getPostTrip,
      updatePostTrip: updatePostTrip,
      //deleteCashBag: deleteCashBag,
      createPostTrip: createPostTrip
    };
  });
