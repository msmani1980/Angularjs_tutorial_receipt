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

    var requestURL = ENV.apiUrl + '/api/cash-bags/:id';

    var requestParameters = {
      id: '@id',
      limit: 50
    };

    var actions = {
      getCashBag: {
        method: 'GET',
        headers: {companyId: 362} // TODO should this always be here?
      },
      updateCashBag: {
        method: 'PUT',
        headers: {companyId: 362} // TODO should this always be here?
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getCashBagList(companyId, optionalPayload) {
      var payload = {};
      if (arguments.length === 2) {
        payload = optionalPayload;
      }

      payload.retailCompanyId = companyId;
      return requestResource.getCashBag(payload).$promise;
    }

    function getCashBag(cashBagId) {
      var payload = {
        id: cashBagId
      };
      return requestResource.getCashBag(payload).$promise;
    }

    function updateCashBag(payload){
      return requestResource.updateCashBag(payload).$promise;
    }

    return {
      getCashBagList: getCashBagList,
      getCashBag: getCashBag,
      updateCashBag: updateCashBag
    };
  })
;
