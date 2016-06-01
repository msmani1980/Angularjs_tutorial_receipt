'use strict';

/**
 * @ngdoc service
 * @name ts5App.stockDashboardService
 * @description
 * # stockDashboardService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stockDashboardService', function($resource, ENV) {

    var requestURL = ENV.apiUrl + '/rsvr/api/stock-management/dashboard/';

    var requestParameters = {};

    var actions = {
      getStockDashboardItems: {
        method: 'GET'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getStockDashboardItems(catererStationId) {
      return requestResource.getStockDashboardItems({
        catererStationId: catererStationId
      }).$promise;
    }

    return {
      getStockDashboardItems: getStockDashboardItems
    };

  });
