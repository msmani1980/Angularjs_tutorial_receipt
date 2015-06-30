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

    var requestURL = ENV.apiUrl + '/api/companies/:id/posttrips';
    var requestParameters = {
      id: '@id'
    };
    var actions = {
      getPostTrips: {
        method: 'GET',
        headers: {companyId: 362} // TODO should this always be here?
      },
      //updatePostTrips: {
      //  method: 'PUT',
      //  headers: {companyId: 362} // TODO should this always be here?
      //},
      //deletePostTrips: {
      //  method: 'DELETE',
      //  headers: {companyId: 362} // TODO should this always be here?
      //},
      createPostTrips: {
        method: 'POST',
        headers: {companyId: 362} // TODO should this always be here?
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getPostTrips(companyId, optionalPayload) {
      var payload = {};
      if (arguments.length === 2) {
        payload = optionalPayload;
      }
      payload.id = companyId;
      return requestResource.getPostTrips(payload).$promise;
    }
    //
    //function getCashBag(cashBagId) {
    //  return requestResource.getCashBag({id:cashBagId}).$promise;
    //}
    //
    //function updateCashBag(cashBagId, payload){
    //  return requestResource.updateCashBag({id:cashBagId}, payload).$promise;
    //}
    //
    //function deleteCashBag(cashBagId){
    //  return requestResource.deleteCashBag({id:cashBagId}).$promise;
    //}
    //
    function createPostTrip(companyId, payload) {
      payload.id = companyId;
      return requestResource.createPostTrips(companyId, payload).$promise;
    }

    return {
      getPostTrips: getPostTrips,
      //getCashBag: getCashBag,
      //updateCashBag: updateCashBag,
      //deleteCashBag: deleteCashBag,
      createPostTrip: createPostTrip
    };
  });
