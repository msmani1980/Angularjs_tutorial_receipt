'use strict';

/**
 * @ngdoc service
 * @name ts5App.reconciliationService
 * @description
 * # reconciliationService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('reconciliationService', function ($resource, ENV) {

    var url = ENV.apiUrl + '/api/reconciliation/stock-totals';
    var requestParameters = {
      storeInstanceId: '@storeInstanceId'
    };

    var actions = {
      getStockTotals: {
        method: 'GET'
      }
    };

    var stockResource = $resource(url, requestParameters, actions);

    function getStockTotals(storeInstanceId) {
      var payload = {
        storeInstanceId: storeInstanceId
      };
      return stockResource.getStockTotals(payload).$promise;
    }

    return {
      getStockTotals: getStockTotals
    }
  });
