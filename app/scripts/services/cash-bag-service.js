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
      id: '@id'
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
      var payload;
      if (arguments.length === 2) {
        payload = optionalPayload;
      } else {
        payload = {};
      }

      payload.retailCompanyId = companyId;
      payload.limit = 50;
      return requestResource.getCashBag(payload).$promise;
    }

    function getCashBag(cashBagId) {
      return requestResource.getCashBag({id:cashBagId}).$promise;
    }

    function updateCashBag(cashBagId, payload){
      return requestResource.updateCashBag({id:cashBagId}, payload).$promise;
    }

    return {
      getCashBagList: getCashBagList,
      getCashBag: getCashBag,
      updateCashBag: updateCashBag
    };
  })
;
