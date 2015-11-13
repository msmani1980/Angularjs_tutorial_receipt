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
    var reconciliationPrecheckSchedulesResourceURL = ENV.apiUrl + '/api/reconciliation/pre-check/:storeInstanceId/schedules';
    var reconciliationPrecheckCashbagsResourceURL = ENV.apiUrl + '/api/reconciliation/pre-check/:storeInstanceId/cashbags';

    var requestParameters = {
      id: '@id',
      storeInstanceId: '@storeInstanceId'
    };

    var actions = {
      getReconciliationPrecheckDevices: {
        method: 'GET'
      },
      getReconciliationPrecheckSchedules: {
        method: 'GET'
      },
      getReconciliationPrecheckCashbags: {
        method: 'GET'
      }
    };

    var reconciliationPrecheckDevicesResource = $resource(reconciliationPrecheckDevicesURL, requestParameters, actions);
    var getReconciliationPrecheckSchedulesResource = $resource(reconciliationPrecheckSchedulesResourceURL, requestParameters, actions);
    var getReconciliationPrecheckCashbagsResource = $resource(reconciliationPrecheckCashbagsResourceURL, requestParameters, actions);

    var getReconciliationPrecheckDevices = function (payload) {
      return reconciliationPrecheckDevicesResource.getReconciliationPrecheckDevices(payload).$promise;
    };

    var getReconciliationPrecheckSchedules = function (payload) {
      return getReconciliationPrecheckSchedulesResource.getReconciliationPrecheckSchedules(payload).$promise;
    };

    var getReconciliationPrecheckCashbags = function (payload) {
      return getReconciliationPrecheckCashbagsResource.getReconciliationPrecheckCashbags(payload).$promise;
    };

    return {
      getReconciliationPrecheckDevices: getReconciliationPrecheckDevices,
      getReconciliationPrecheckSchedules: getReconciliationPrecheckSchedules,
      getReconciliationPrecheckCashbags: getReconciliationPrecheckCashbags
    };
  });
