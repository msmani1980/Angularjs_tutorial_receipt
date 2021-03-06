'use strict';

/**
 * @ngdoc service
 * @name ts5App.characteristicsService
 * @description
 * # characteristicsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('characteristicsService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/rsvr/api/records/characteristics/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCharacteristicsList: {
        method: 'GET',
        isArray: true
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCharacteristicsList = function (payload) {
      return requestResource.getCharacteristicsList(payload).$promise;
    };

    return {
      getCharacteristicsList: getCharacteristicsList
    };

  });
