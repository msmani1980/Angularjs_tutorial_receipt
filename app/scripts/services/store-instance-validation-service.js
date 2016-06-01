'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeInstanceValidationService
 * @description
 * # storeInstanceValidationService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeInstanceValidationService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/rsvr/api/dispatch/store-instances/validate';
    var requestParameters = { };
    var actions = {
      validateStoreInstance: {
        method: 'PUT'
      }
    };
    var requestResource = $resource(requestURL, requestParameters, actions);

    function validateStoreInstance(payload) {
      return requestResource.validateStoreInstance(payload).$promise;
    }

    return {
      validateStoreInstance: validateStoreInstance
    };
  });
