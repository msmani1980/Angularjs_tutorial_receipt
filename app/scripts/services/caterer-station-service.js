'use strict';

/**
 * @ngdoc service
 * @name ts5App.catererStationService
 * @description
 * # catererStationService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('catererStationService', function ($resource, ENV) {
    var requestURL = ENV.apiUrl + '/menus/caterer-stations/:id';
    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getCatererStationList: {
        method: 'GET'
      },
      getCatererStation: {
        method: 'GET'
      },
      createCatererStation: {
        method: 'POST'
      },
      updateCatererStation: {
        method: 'PUT'
      },
      deleteCatererStation: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCatererStationList = function (payload) {
      return requestResource.getCatererStationList(payload).$promise;
    };

    var getCatererStation = function (cateringStationId) {
      return requestResource.getCatererStation({
        id: cateringStationId
      }).$promise;
    };

    var deleteCatererStation = function (cateringStationId) {
      return requestResource.deleteCatererStation({
        id: cateringStationId
      }).$promise;
    };

    var updateCatererStation = function (payload) {
      return requestResource.updateCatererStation(payload).$promise;
    };

    var createCatererStation = function (payload) {
      return requestResource.createCatererStation(payload).$promise;
    };

    return {
      getCatererStationList: getCatererStationList,
      deleteCatererStation: deleteCatererStation,
      getCatererStation: getCatererStation,
      updateCatererStation: updateCatererStation,
      createCatererStation: createCatererStation
    };
  });
