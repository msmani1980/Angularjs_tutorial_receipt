'use strict';

/**
 * @ngdoc service
 * @name ts5App.stockManagementStationItemsService
 * @description
 * # stockManagementStationItemsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stockManagementStationItemsService', function($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/stock-management/station-items/:id';

    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getStockManagementStationItems: {
        method: 'GET'
      },
      updateStockManagementStationItems: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStockManagementStationItems(catererStationId, limit, offset) {
      return requestResource.getStockManagementStationItems({
        stationId: catererStationId,
        limit: limit,
        offset: offset
      }).$promise;
    }

    function updateStockManagementStationItems(id, payload) {
      return requestResource.updateStockManagementStationItems({id: id}, payload).$promise;
    }

    return {
      getStockManagementStationItems: getStockManagementStationItems,
      updateStockManagementStationItems: updateStockManagementStationItems
    };

  });
