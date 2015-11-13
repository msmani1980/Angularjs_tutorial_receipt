'use strict';

/**
 * @ngdoc service
 * @name ts5App.reconciliationService
 * @description
 * # reconciliationService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('reconciliationService', function ($q, $resource, ENV) {

    var reconciliationPrecheckDevicesURL = ENV.apiUrl + '/api/reconciliation/pre-check/:storeInstanceId/devices';

    var requestParameters = {
      id: '@id',
      storeInstanceId: '@storeInstanceId'
    };

    var actions = {
      getReconciliationPrecheckDevices: {
        method: 'GET'
      }
    };

    var reconciliationPrecheckDevicesResource = $resource(reconciliationPrecheckDevicesURL, requestParameters, actions);

    var getReconciliationPrecheckDevices = function (payload) {
      return reconciliationPrecheckDevicesResource.getReconciliationPrecheckDevices(payload).$promise;
    };

    return {
      getReconciliationPrecheckDevices: getReconciliationPrecheckDevices
    };
  });
