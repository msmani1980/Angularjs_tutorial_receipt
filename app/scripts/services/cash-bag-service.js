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
    var manualCashBagRequestURL = ENV.apiUrl + '/rsvr/api/cashbag/:id/:type/:recordId';

    var requestParameters = {
      id: '@id',
      submission: '@submission',
      type: '@type'
    };

    var cashBagCurrencyRequestParams = {
      currencyId: '@currencyId'
    };

    var manualCashBagRequestParams = {
      id: '@id',
      recordId: '@recordId',
      type: '@type'
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

    var requestResource = $resource(requestURL, requestParameters, actions);
    var cashBagCurrencyRequestResources = $resource(cashBagCurrencyRequestURL, cashBagCurrencyRequestParams, actions);
    var carrierInstancesRequestResource = $resource(carrierInstancesRequestURL, requestParameters, actions);
    var reallocateRequestResource = $resource(reallocationRequestURL, requestParameters, actions);
    var mergeRequestResource = $resource(mergeRequestURL, requestParameters, actions);
    var verifyRequestResource = $resource(verifyRequestURL, requestParameters, actions);
    var unverifyRequestResource = $resource(unverifyRequestURL, requestParameters, actions);
    var cashBagVerificationsRequestResource = $resource(cashBagVerificationsRequestURL, requestParameters, actions);
    var manualCashBagRequestResource = $resource(manualCashBagRequestURL, manualCashBagRequestParams, actions);

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

    function getManualCashBagList(manualType, cashBagId, payload) {
      manualCashBagRequestParams.id = cashBagId;
      manualCashBagRequestParams.recordId = '';
      manualCashBagRequestParams.type = manualType;
      return manualCashBagRequestResource.getManualCashBagList(payload).$promise;
    }

    function getManualCashBagRecord(manualType, cashBagId, currencyId) {
      manualCashBagRequestParams.id = cashBagId;
      manualCashBagRequestParams.recordId = currencyId;
      manualCashBagRequestParams.type = manualType;
      return manualCashBagRequestResource.getManualCashBagRecord().$promise;
    }

    function createManualCashBagRecord(manualType, cashBagId, payload) {
      manualCashBagRequestParams.id = cashBagId;
      manualCashBagRequestParams.recordId = '';
      manualCashBagRequestParams.type = manualType;
      return manualCashBagRequestResource.createManualCashBagRecord(payload).$promise;
    }

    function updateManualCashBagRecord(manualType, cashBagId, currencyId, payload) {
      manualCashBagRequestParams.id = cashBagId;
      manualCashBagRequestParams.recordId = currencyId;
      manualCashBagRequestParams.type = manualType;
      return manualCashBagRequestResource.updateManualCashBagRecord(payload).$promise;
    }

    function deleteManualCashBagRecord(manualType, cashBagId, currencyId) {
      manualCashBagRequestParams.id = cashBagId;
      manualCashBagRequestParams.recordId = currencyId;
      manualCashBagRequestParams.type = manualType;
      return manualCashBagRequestResource.deleteManualCashBagRecord().$promise;
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
      getManualCashBagList: getManualCashBagList,
      getManualCashBagRecord: getManualCashBagRecord,
      createManualCashBagRecord: createManualCashBagRecord,
      updateManualCashBagRecord: updateManualCashBagRecord,
      deleteManualCashBagRecord: deleteManualCashBagRecord
    };
  });
