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

    var requestURL = ENV.apiUrl + '/rsvr/api/feature/:featureCode/thresholds/:thresholdId';

    var requestParameters = {
      featureCode: '@featureCode',
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

    function getThresholdList(featureCode, optionalPayload) {
      requestParameters.featureCode = featureCode;
      requestParameters.thresholdId = '';
      var payload = optionalPayload || {};
      return requestResource.getThresholdList(payload).$promise;
    }

    function getThreshold(featureCode, thresholdId) {
      return requestResource.getThreshold({ featureCode: featureCode, thresholdId: thresholdId }).$promise;
    }

    return {
      getThresholdList: getThresholdList,
      getThreshold: getThreshold
    };
  });
