'use strict';

/**
 * @ngdoc service
 * @name ts5App.featureThresholdsFactory
 * @description
 * # featureThresholdsFactory
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('featureThresholdsFactory', function(featureThresholdsService) {
    function getThresholdList(featureCode, payload, optionalCompanyId) {
      return featureThresholdsService.getThresholdList(featureCode, payload, optionalCompanyId);
    }

    function getThreshold(featureCode, thresholdId) {
      return featureThresholdsService.getThreshold(featureCode, thresholdId);
    }

    function createThreshold(featureCode, payload) {
      return featureThresholdsService.createThreshold(featureCode, payload);
    }

    function updateThreshold(featureCode, payload, thresholdId) {
      return featureThresholdsService.updateThreshold(featureCode, payload, thresholdId);
    }

    function deleteThreshold(featureCode, thresholdId) {
      return featureThresholdsService.deleteThreshold(featureCode, thresholdId);
    }

    return {
      getThresholdList: getThresholdList,
      getThreshold: getThreshold,
      createThreshold: createThreshold,
      updateThreshold: updateThreshold,
      deleteThreshold: deleteThreshold
    };
  });
