'use strict';

/**
 * @ngdoc service
 * @name ts5App.featureThresholdsService
 * @description
 * # featureThresholdsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('featureThresholdsService', function($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/:featureId/thresholds/:thresholdId';

    var requestParameters = {
      featureId: '@featureId',
      thresholdId: '@thresholdId'
    };

    var actions = {
      getThresholdList: {
        method: 'GET'
      },
      getThreshold: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getThresholdList(featureId) {
      return requestResource.getThresholdList({featureId: featureId, thresholdId: ''}).$promise;
    }

    function getThreshold(featureId, thresholdId) {
      return requestResource.getThreshold({featureId: featureId, thresholdId: thresholdId}).$promise;
    }

    return {
      getThresholdList: getThresholdList,
      getThreshold: getThreshold
    };
  });
