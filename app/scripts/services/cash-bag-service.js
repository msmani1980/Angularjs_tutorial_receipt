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

    var requestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/:submission';
    var cashBagCurrencyRequestURL = ENV.apiUrl + '/rsvr/api/cashbag-currencies/:currencyId';
    var carrierInstancesRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/carrier-instances';
    var reallocationRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/reallocate';
    var mergeRequestURL = ENV.apiUrl + '/rsvr/api/cash-bags/:id/merge';
    var verifyRequestURL = ENV.apiUrl + '/rsvr/api/cashbags/:id/verify/:type';
    var unverifyRequestURL = ENV.apiUrl + '/rsvr/api/cashbags/:id/unverify/:type';
    var cashBagVerificationsRequestURL = ENV.apiUrl + '/rsvr/api/cashbags/:id';
    var manualCashBagRequestURL = ENV.apiUrl + '/rsvr/api/cashbag/:cashBagId/cash/:recordId';
    var allManualCashBagsRequestURL = ENV.apiUrl + '/rsvr/api/cashbags/cash/';
    var manualEposDataRequestURL = ENV.apiUrl + '/rsvr/api/cashbag-:type/:recordId';

    var requestCashBagParameters = {
      id: '@id',
      submission: '@submission'
    };

    var requestParameters = {
      id: '@id',
      submission: '@submission',
      type: '@type'
    };

    var cashBagCurrencyRequestParams = {
      currencyId: '@currencyId'
    };

    var manualEposDataRequestParams = {
      recordId: '@recordId',
      type: '@type'
    };

    var manualEposCashRequestParams = {
      recordId: '@recordId',
      cashBagId: '@cashBagId'
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
      verifyCashBag: {
        method: 'PUT'
      },
      unverifyCashBag: {
        method: 'PUT'
      },
      getCashBagVerifications: {
        method: 'GET'
      },
      getManualCashBagList: {
        method: 'GET'
      },
      getManualCashBagRecord: {
        method: 'GET'
      },
      createManualCashBagRecord: {
        method: 'POST'
      },
      updateManualCashBagRecord: {
        method: 'PUT'
      },
      deleteManualCashBagRecord: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestCashBagParameters, actions);
    var cashBagCurrencyRequestResources = $resource(cashBagCurrencyRequestURL, cashBagCurrencyRequestParams, actions);
    var carrierInstancesRequestResource = $resource(carrierInstancesRequestURL, requestParameters, actions);
    var reallocateRequestResource = $resource(reallocationRequestURL, requestParameters, actions);
    var mergeRequestResource = $resource(mergeRequestURL, requestParameters, actions);
    var verifyRequestResource = $resource(verifyRequestURL, requestParameters, actions);
    var unverifyRequestResource = $resource(unverifyRequestURL, requestParameters, actions);
    var cashBagVerificationsRequestResource = $resource(cashBagVerificationsRequestURL, requestParameters, actions);
    var allManualCashBagsRequestResource = $resource(allManualCashBagsRequestURL, {}, actions);
    var manualCashBagRequestResource = $resource(manualCashBagRequestURL, manualEposCashRequestParams, actions);
    var manualEposDataRequestResource = $resource(manualEposDataRequestURL, manualEposDataRequestParams, actions);

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

    function getCashBagVerifications(payload) {
      return cashBagVerificationsRequestResource.getCashBagVerifications(payload).$promise;
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

    var verifyCashBag = function (cashBagId, type) {
      var payload = {
        id: cashBagId,
        type: type
      };

      return verifyRequestResource.verifyCashBag(payload).$promise;
    };

    var unverifyCashBag = function (cashBagId, type) {
      var payload = {
        id: cashBagId,
        type: type
      };

      return unverifyRequestResource.unverifyCashBag(payload).$promise;
    };

    function getAllManualCashList (payload) {
      var payloadForRequest = payload || {};
      return allManualCashBagsRequestResource.getManualCashBagList(payloadForRequest).$promise;
    }

    function getManualCashBagCashList(cashBagId, payload) {
      manualEposCashRequestParams.cashBagId = cashBagId;
      manualEposCashRequestParams.recordId = '';
      var payloadForRequest = payload || {};
      return manualCashBagRequestResource.getManualCashBagList(payloadForRequest).$promise;
    }

    function getManualCashBagCashRecord(cashBagId, recordId) {
      manualEposCashRequestParams.cashBagId = cashBagId;
      manualEposCashRequestParams.recordId = recordId;
      return manualCashBagRequestResource.getManualCashBagRecord().$promise;
    }

    function createManualCashBagCashRecord(cashBagId, payload) {
      manualEposCashRequestParams.cashBagId = cashBagId;
      manualEposCashRequestParams.recordId = '';
      var payloadForRequest = payload || {};
      return manualCashBagRequestResource.createManualCashBagRecord(payloadForRequest).$promise;
    }

    function updateManualCashBagCashRecord(cashBagId, recordId, payload) {
      manualEposCashRequestParams.cashBagId = cashBagId;
      manualEposCashRequestParams.recordId = recordId;
      var payloadForRequest = payload || {};
      return manualCashBagRequestResource.updateManualCashBagRecord(payloadForRequest).$promise;
    }

    function getManualCashBagList(manualType, payload) {
      manualEposDataRequestParams.recordId = '';
      manualEposDataRequestParams.type = manualType;
      var payloadForRequest = payload || {};
      return manualEposDataRequestResource.getManualCashBagList(payloadForRequest).$promise;
    }

    function getManualCashBagRecord(manualType, recordId) {
      manualEposDataRequestParams.recordId = recordId;
      manualEposDataRequestParams.type = manualType;
      return manualEposDataRequestResource.getManualCashBagRecord().$promise;
    }

    function createManualCashBagRecord(manualType, payload) {
      manualEposDataRequestParams.recordId = '';
      manualEposDataRequestParams.type = manualType;
      var payloadForRequest = payload || {};
      return manualEposDataRequestResource.createManualCashBagRecord(payloadForRequest).$promise;
    }

    function updateManualCashBagRecord(manualType, recordId, payload) {
      manualEposDataRequestParams.recordId = recordId;
      manualEposDataRequestParams.type = manualType;
      return manualEposDataRequestResource.updateManualCashBagRecord(payload).$promise;
    }

    function deleteManualCashBagRecord(manualType, recordId) {
      manualEposDataRequestParams.recordId = recordId;
      manualEposDataRequestParams.type = manualType;
      return manualEposDataRequestResource.deleteManualCashBagRecord().$promise;
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
      verifyCashBag: verifyCashBag,
      unverifyCashBag: unverifyCashBag,
      getCashBagVerifications: getCashBagVerifications,
      getAllManualCashList: getAllManualCashList,
      getManualCashBagCashList: getManualCashBagCashList,
      getManualCashBagCashRecord: getManualCashBagCashRecord,
      createManualCashBagCashRecord: createManualCashBagCashRecord,
      updateManualCashBagCashRecord: updateManualCashBagCashRecord,
      getManualCashBagList: getManualCashBagList,
      getManualCashBagRecord: getManualCashBagRecord,
      createManualCashBagRecord: createManualCashBagRecord,
      updateManualCashBagRecord: updateManualCashBagRecord,
      deleteManualCashBagRecord: deleteManualCashBagRecord
    };
  });
