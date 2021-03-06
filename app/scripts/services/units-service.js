'use strict';

/**
 * @ngdoc service
 * @name ts5App.unitsService
 * @description
 * # unitsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('unitsService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/rsvr/api/units';

    var dimensionParameters = {
      unitType:'dimension'
    };

    var volumeParameters = {
      unitType:'volume'
    };

    var weightParameters = {
      unitType:'weight'
    };

    var distanceParameters = {
      unitType:'distance'
    };

    var actions = {
      getDimensionList: {
        method: 'GET'
      },
      getVolumeList: {
        method: 'GET'
      },
      getWeightList: {
        method: 'GET'
      },
      getDistanceList: {
        method: 'GET'
      }
    };

    var getDimensionList = function (payload) {
      var requestResource = $resource(requestURL, dimensionParameters, actions);
      return requestResource.getDimensionList(payload).$promise;
    };

    var getVolumeList = function (payload) {
      var requestResource = $resource(requestURL, volumeParameters, actions);
      return requestResource.getVolumeList(payload).$promise;
    };

    var getWeightList = function (payload) {
      var requestResource = $resource(requestURL, weightParameters, actions);
      return requestResource.getWeightList(payload).$promise;
    };

    var getDistanceList = function (payload) {
      var requestResource = $resource(requestURL, distanceParameters, actions);
      return requestResource.getDistanceList(payload).$promise;
    };

    return {
      getDimensionList: getDimensionList,
      getVolumeList: getVolumeList,
      getWeightList: getWeightList,
      getDistanceList: getDistanceList
    };

  });
