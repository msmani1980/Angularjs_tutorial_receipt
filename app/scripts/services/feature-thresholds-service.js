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
        method: 'GET',
        headers: {}
      },
      getThreshold: {
        method: 'GET'
      },
      createThreshold: {
        method: 'POST'
      },
      updateThreshold: {
        method: 'PUT'
      },
      deleteThreshold: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getThresholdList(featureCode, payload, optionalCompanyId) {
      requestParameters.featureCode = featureCode;
      requestParameters.thresholdId = '';

      if (optionalCompanyId) {
        actions.getThresholdList.headers.companyId = optionalCompanyId;
      }

      return requestResource.getThresholdList(payload).$promise;
    }

    function getThreshold(featureCode, thresholdId) {
      return requestResource.getThreshold({ featureCode: featureCode, thresholdId: thresholdId }).$promise;
    }

    function createThreshold(featureCode, payload) {
      requestParameters.featureCode = featureCode;
      requestParameters.thresholdId = '';

      return requestResource.createThreshold(payload).$promise;
    }

    function updateThreshold(featureCode, payload, thresholdId) {
      requestParameters.featureCode = featureCode;
      requestParameters.thresholdId = thresholdId;

      return requestResource.updateThreshold(payload).$promise;
    }

    function deleteThreshold(featureCode, thresholdId) {
      requestParameters.featureCode = featureCode;
      requestParameters.thresholdId = thresholdId;

      return requestResource.deleteThreshold().$promise;
    }

    return {
      getThresholdList: getThresholdList,
      getThreshold: getThreshold,
      createThreshold: createThreshold,
      updateThreshold: updateThreshold,
      deleteThreshold: deleteThreshold
    };
  });
