'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReasonCodesService
 * @description
 * # companyReasonCodesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyReasonCodesService', function ($resource, ENV) {

    // AngularJS will instantiate a singleton by calling "new" on this function
    var companyReasonRequestURL = ENV.apiUrl + '/rsvr/api/company-reason-codes/:reasonId';
    var reasonTypeRequestURL = ENV.apiUrl + '/rsvr/api/company-reason-types';

    var reasonActions = {
      getCompanyReasonCodes: {
        method: 'GET'
      },
      getReasonTypes: {
        method: 'GET'
      },
      getCompanyReasonCodeById: {
        method: 'GET',
        headers: {}
      },
      createCompanyReasonCode: {
        method: 'POST',
        headers: {}
      },
      updateCompanyReasonCode: {
        method: 'PUT',
        headers: {}
      },
      deleteCompanyReasonCode: {
        method: 'DELETE',
        headers: {}
      }
    };

    var companyReasonRequestResource = $resource(companyReasonRequestURL, null, reasonActions);
    var reasonTypeRequestResource = $resource(reasonTypeRequestURL, null, reasonActions);

    var getCompanyReasonCodes = function (payload, additionalPayload) {
      if (additionalPayload) {
        angular.extend(payload, additionalPayload);
      }

      return companyReasonRequestResource.getCompanyReasonCodes(payload).$promise;
    };

    var getReasonTypes = function () {
      var payload = {};

      return reasonTypeRequestResource.getReasonTypes(payload).$promise;
    };

    var getCompanyReasonCodeById = function (reasonId) {
      var requestParameters = {
        id: reasonId
      };

      return companyReasonRequestResource.getCompanyReasonCodeById(requestParameters, reasonId).$promise;
    };

    var createCompanyReasonCode = function (payload) {

      return companyReasonRequestResource.createCompanyReasonCode(payload).$promise;
    };

    var updateCompanyReasonCode = function (reasonId, payload) {
      var requestParameters = {
        id: reasonId
      };

      return companyReasonRequestResource.updateCompanyReasonCode(requestParameters, payload).$promise;
    };

    var deleteCompanyReasonCode = function (reasonId) {
      var payload = {
        id: reasonId 
      };

      return companyReasonRequestResource.deleteCompanyReasonCode(payload).$promise;
    };

    return {
      getCompanyReasonCodes: getCompanyReasonCodes,
      getReasonTypes: getReasonTypes,
      getCompanyReasonCodeById: getCompanyReasonCodeById,
      createCompanyReasonCode: createCompanyReasonCode,
      updateCompanyReasonCode: updateCompanyReasonCode,
      deleteCompanyReasonCode: deleteCompanyReasonCode
    };

  });
