'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeTimeConfig
 * @description
 * # storeTimeConfig
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeTimeConfig', function($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/companies/time-configuration';

    var actions = {
      getTimeConfig: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, {}, actions);

    function getTimeConfig(storeInstanceId) {
      return requestResource.getTimeConfig({
        storeInstanceId: storeInstanceId
      }).$promise;
    }

    return {
      getTimeConfig: getTimeConfig
    };
  });
