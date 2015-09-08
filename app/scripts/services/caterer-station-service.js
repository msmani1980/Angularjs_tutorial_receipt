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
    var requestURL = ENV.apiUrl + '/api/caterer-stations/:id/:menuItems';
    var requestParameters = {
      id: '@id',
      menuItems:'@menuItems'
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
      },
      getAllMenuItems: {
        method: 'GET'
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

    var getAllMenuItems = function(cateringStationId, limit) {
      var payload = {
        id: cateringStationId,
        menuItems: 'menu-items',
        limit: limit
      };
      return requestResource.getAllMenuItems(payload).$promise;
    };

    return {
      getCatererStationList: getCatererStationList,
      deleteCatererStation: deleteCatererStation,
      getCatererStation: getCatererStation,
      updateCatererStation: updateCatererStation,
      createCatererStation: createCatererStation,
      getAllMenuItems: getAllMenuItems
    };
  });
