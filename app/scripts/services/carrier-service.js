'use strict';

/**
 * @ngdoc service
 * @name ts5App.carrierService
 * @description
 * # carrierService
 * Service in the ts5App.
 */
angular.module('ts5App').service('carrierService', function ($resource, ENV) {

  var carrierRequestURL = ENV.apiUrl + '/rsvr/api/companies/:id/carrier-types';
  var carrierNumberRequestURL = carrierRequestURL + '/:type/carrier-numbers/:carrierNumberId';

  var carrierActions = {
    getCarrierTypes: {
      method: 'GET'
    },
    getCarrierNumbers: {
      method: 'GET'
    }
  };

  var requestParameters = {
    id: '@id',
    type: '@type',
    carrierNumberId: '@carrierNumberId'
  };

  var carrierTypeRequestResource = $resource(carrierRequestURL, requestParameters, carrierActions);
  var carrierNumberRequestResource = $resource(carrierNumberRequestURL, requestParameters, carrierActions);

  var getCarrierTypes = function (companyId) {
    var payload = { id: companyId };
    return carrierTypeRequestResource.getCarrierTypes(payload).$promise;
  };

  var getCarrierNumbers = function (companyId, carrierType, optionalPayload) {
    var allCarrierTypesFlag = 0;  // 0 passed in to get carrier numbers for all carrier types
    var payload = optionalPayload || {};
    payload.id = companyId;
    payload.type = carrierType || allCarrierTypesFlag;
    return carrierNumberRequestResource.getCarrierNumbers(payload).$promise;
  };

  var getCarrierNumber = function (companyId, carrierNumberId) {
    var payload = {
      id: companyId,
      type: 0,
      carrierNumberId: carrierNumberId
    };
    return carrierNumberRequestResource.getCarrierNumbers(payload).$promise;
  };

  return {
    getCarrierTypes: getCarrierTypes,
    getCarrierNumbers: getCarrierNumbers,
    getCarrierNumber: getCarrierNumber
  };

});
