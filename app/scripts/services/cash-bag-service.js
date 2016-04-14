'use strict';

/**
 * @ngdoc service
 * @name ts5App.cashBagService
 * @description
 * # cashBagService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('cashBagService', function ($resource, ENV) {

    var requestURL = ENV.apiUrl + '/api/cash-bags/:id/:submission';
    var cashBagCurrencyRequestURL = ENV.apiUrl + '/rsvr/api/cashbag-currencies/:currencyId';
    var carrierInstancesRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/carrier-instances';
    var reallocationRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/reallocate';
    var mergeRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/merge';
    var cashBagCashRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/cash/:currencyId';

    var requestParameters = {
      id: '@id',
      submission: '@submission'
    };

    var cashBagCurrencyRequestParams = {
      currencyId: '@currencyId'
    };

    var cashBagCashRequestParams = {
      id: '@id',
      currencyId: '@currencyId'
    };

    var actions = {
      getCashBag: {
        method: 'GET'
      },
      updateCashBag: {
        method: 'PUT'
      },
      deleteCashBag: {
        method: 'DELETE'
      },
      createCashBag: {
        method: 'POST'
      },
      updateCashBagCurrency: {
        method: 'PUT'
      },
      getCashBagCarrierInstances: {
        method: 'GET'
      },
      reallocateCashBag: {
        method: 'PUT'
      },
      mergeCashBag: {
        method: 'PUT'
      },
      getCashBagCashList: {
        method: 'GET'
      },
      getCashBagCash: {
        method: 'GET'
      },
      createCashBagCash: {
        method: 'POST'
      },
      updateCashBagCash: {
        method: 'PUT'
      },
      deleteCashBagCash: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);
    var cashBagCurrencyRequestResources = $resource(cashBagCurrencyRequestURL, cashBagCurrencyRequestParams, actions);
    var carrierInstancesRequestResource = $resource(carrierInstancesRequestURL, requestParameters, actions);
    var reallocateRequestResource = $resource(reallocationRequestURL, requestParameters, actions);
    var mergeRequestResource = $resource(mergeRequestURL, requestParameters, actions);
    var cashBagCashRequestResource = $resource(cashBagCashRequestURL, cashBagCashRequestParams, actions);

    function getCashBagList(companyId, optionalPayload) {
      var payload = {};
      if (arguments.length === 2) {
        payload = optionalPayload;
      }

      payload.retailCompanyId = companyId;
      if (!angular.isDefined(payload.limit)) {
        payload.limit = 50;
      }

      return requestResource.getCashBag(payload).$promise;
    }

    function getCashBag(cashBagId) {
      return requestResource.getCashBag({ id: cashBagId }).$promise;
    }

    function updateCashBag(cashBagId, payload, parameters) {
      if (cashBagId && !parameters) {
        parameters = { id: cashBagId };
      }

      return requestResource.updateCashBag(parameters, payload).$promise;
    }

    function deleteCashBag(cashBagId) {
      return requestResource.deleteCashBag({ id: cashBagId }).$promise;
    }

    function createCashBag(payload) {
      return requestResource.createCashBag(payload).$promise;
    }

    function updateCashBagCurrency(currencyId, payload) {
      cashBagCurrencyRequestParams.currencyId = currencyId;
      return cashBagCurrencyRequestResources.updateCashBagCurrency(payload).$promise;
    }

    function reallocateCashBag(cashBagId, storeInstanceId) {
      var payload = {
        id: cashBagId,
        storeInstanceId: storeInstanceId
      };

      return reallocateRequestResource.reallocateCashBag(payload).$promise;
    }

    function mergeCashBag(eposCashBagId, manualCashBagId) {
      var payload = {
        id: eposCashBagId,
        manualCashBagId: manualCashBagId
      };

      return mergeRequestResource.mergeCashBag(payload).$promise;
    }

    function getCashBagCarrierInstances(cashBagId) {
      return carrierInstancesRequestResource.getCashBagCarrierInstances({ id: cashBagId }).$promise;
    }

    function getCashBagCashList(cashBagId, payload) {
      cashBagCashRequestParams.id = cashBagId;
      cashBagCashRequestParams.currencyId = '';
      return cashBagCashRequestResource.getCashBagCashList(payload).$promise;
    }

    function getCashBagCash(cashBagId, currencyId) {
      cashBagCashRequestParams.id = cashBagId;
      cashBagCashRequestParams.currencyId = currencyId;
      return cashBagCashRequestResource.getCashBagCash().$promise;
    }

    function createCashBagCash(cashBagId, payload) {
      cashBagCashRequestParams.id = cashBagId;
      cashBagCashRequestParams.currencyId = '';
      return cashBagCashRequestResource.createCashBagCash(payload).$promise;
    }

    function updateCashBagCash(cashBagId, currencyId, payload) {
      cashBagCashRequestParams.id = cashBagId;
      cashBagCashRequestParams.currencyId = currencyId;
      return cashBagCashRequestResource.updateCashBagCash(payload).$promise;
    }

    function deleteCashBagCash(cashBagId, currencyId) {
      cashBagCashRequestParams.id = cashBagId;
      cashBagCashRequestParams.currencyId = currencyId;
      return cashBagCashRequestResource.deleteCashBagCash().$promise;
    }

    return {
      getCashBagList: getCashBagList,
      getCashBag: getCashBag,
      updateCashBag: updateCashBag,
      deleteCashBag: deleteCashBag,
      createCashBag: createCashBag,
      updateCashBagCurrency: updateCashBagCurrency,
      getCashBagCarrierInstances: getCashBagCarrierInstances,
      reallocateCashBag: reallocateCashBag,
      mergeCashBag: mergeCashBag,
      getCashBagCashList: getCashBagCashList,
      getCashBagCash: getCashBagCash,
      createCashBagCash: createCashBagCash,
      updateCashBagCash: updateCashBagCash,
      deleteCashBagCash: deleteCashBagCash
    };
  });
