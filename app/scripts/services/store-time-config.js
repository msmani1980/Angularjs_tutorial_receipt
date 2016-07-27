'use strict';

/**
 * @ngdoc service
 * @name ts5App.storeTimeConfig
 * @description
 * # storeTimeConfig
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('storeTimeConfig', function($resource, ENV, dateUtility) {

    var requestURL = ENV.apiUrl + '/rsvr/api/companies/time-configuration';

    var actions = {
      getTimeConfig: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, {}, actions);

    function getTimeConfig(storeInstanceId) {
      return requestResource.getTimeConfig({
        startDate: dateUtility.formatDateForAPI(dateUtility.nowFormatted()),
        storeInstanceId: storeInstanceId
      }).$promise;
    }

    return {
      getTimeConfig: getTimeConfig
    };
  });
