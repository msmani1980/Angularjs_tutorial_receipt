'use strict';

/**
 * @ngdoc service
 * @name ts5App.stockAdjustmentsService
 * @description
 * # stockAdjustments
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('stockAdjustmentsService', function($resource, ENV) {
    var requestURL = ENV.apiUrl + '/api/stock-management/stock-adjustments';

    var requestParameters = {};

    var actions = {
      adjustStock: {
        method: 'PUT'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function adjustStock(payload) {
      return requestResource.adjustStock(payload).$promise;
    }

    return {
      adjustStock: adjustStock
    };
  });
