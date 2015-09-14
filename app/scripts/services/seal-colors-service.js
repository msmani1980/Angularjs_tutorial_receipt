'use strict';

/**
 * @ngdoc service
 * @name ts5App.sealColorsService
 * @description
 * # sealColorsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('sealColorsService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/seal/colors';

    var actions = {
      getSealColors: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, {}, actions);

    function getSealColors() {
      return requestResource.getSealColors().$promise;
    }

    return {
      getSealColors: getSealColors
    };

  });
