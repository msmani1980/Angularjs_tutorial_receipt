'use strict';

/**
 * @ngdoc service
 * @name ts5App.eulaService
 * @description
 * # eulaService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('eulaService', function($resource, ENV) {

    var requestURL = ENV.apiUrl + '/rsvr/api/eula/:version';

    var requestParameters = {
      version: '@version'
    };

    var actions = {
      getEULAList: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      getEULA: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getEULAList = function() {
      return requestResource.getEULAList().$promise;
    };

    var getEULA = function(version) {
      return requestResource.getEULA({
        version: version
      }).$promise;
    };

    return {
      getEULAList: getEULAList,
      getEULA: getEULA
    };

  });
