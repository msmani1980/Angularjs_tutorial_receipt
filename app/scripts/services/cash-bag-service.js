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

    var requestURL = ENV.apiUrl + '/api/cash-bags';

    var requestParameters = {
      limit: 50
    };

    var actions = {
      getCashBagList: {
        method: 'GET',
        headers: {companyId:362}
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    function getCashBagList(companyId) {
      var payload = {
        retailCompanyId: companyId
      };
      return requestResource.getCashBagList(payload).$promise;
    }

    return {
      getCashBagList:getCashBagList
    }
  });
