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

    var requestParameters = {
      id: '@id',
      submission: '@submission'
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
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

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

    return {
      getCashBagList: getCashBagList,
      getCashBag: getCashBag,
      updateCashBag: updateCashBag,
      deleteCashBag: deleteCashBag,
      createCashBag: createCashBag
    };
  });
