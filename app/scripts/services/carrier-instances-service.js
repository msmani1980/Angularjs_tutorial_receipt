'use strict';

/**
 * @ngdoc service
 * @name ts5App.exciseDutyService
 * @description
 * # exciseDutyService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('carrierInstancesService', function ($resource, ENV) {

    var carrierInstancesRequestURL = ENV.apiUrl + '/rsvr/api/carrier-instances/:id';
    var requestParameters = {
      id: '@id'
    };
    var actions = {
      getCarrierInstances: {
        method: 'GET'
      },
      updateCarrierInstance: {
        method: 'PUT'
      }
    };
    var carrierInstanceRequestResource = $resource(carrierInstancesRequestURL, requestParameters, actions);

    var getCarrierInstances = function (payload) {
      requestParameters.id = '';
      var requestPayload = payload || {};
      return carrierInstanceRequestResource.getCarrierInstances(requestPayload).$promise;
    };

    var updateCarrierInstance = function (id, payload) {
      requestParameters.id = id;
      return carrierInstanceRequestResource.updateCarrierInstance(payload).$promise;
    };

    return {
      getCarrierInstances: getCarrierInstances,
      updateCarrierInstance: updateCarrierInstance
    };

  });
