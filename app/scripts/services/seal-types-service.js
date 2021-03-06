'use strict';

/**
 * @ngdoc service
 * @name ts5App.sealTypesService
 * @description
 * # sealTypesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('sealTypesService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/rsvr/api/records/seal-types';

    var actions = {
      getSealTypes: {
        method: 'GET',
        isArray: true
      }
    };

    var requestResource = $resource(requestURL, {}, actions);

    function getSealTypes() {
      return requestResource.getSealTypes().$promise;
    }

    return {
      getSealTypes: getSealTypes
    };
  });
