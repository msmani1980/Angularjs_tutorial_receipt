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

    var requestURL = ENV.apiUrl + '/api/feature/:featureCode/thresholds/:thresholdId';

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

    function getThresholdList(featureCode) {
      return requestResource.getThresholdList({featureCode: featureCode, thresholdId: ''}).$promise;
    }

    function getThreshold(featureCode, thresholdId) {
      return requestResource.getThreshold({featureCode: featureCode, thresholdId: thresholdId}).$promise;
    }

    return {
      getThresholdList: getThresholdList,
      getThreshold: getThreshold
    };
  });
