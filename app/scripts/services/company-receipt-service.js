'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReceiptService
 * @description
 * # companyReceiptService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyReceiptService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/company-receipts/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCompanyReceipts: {
        method: 'GET'
      },
      getCompanyReceipt: {
        method: 'GET'
      },
      createCompanyReceipt: {
        method: 'POST'
      },
      updateCompanyReceipt: {
        method: 'PUT'
      },
      removeCompanyReceipt: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyReceipts = function (payload) {
      return requestResource.getCompanyReceipts(payload).$promise;
    };

    var getCompanyReceipt = function (id) {
      return requestResource.getCompanyReceipt({ id: id }).$promise;
    };

    var createCompanyReceipt = function (payload) {
      return requestResource.createCompanyReceipt(payload).$promise;
    };

    var updateCompanyReceipt = function (id, payload) {
      return requestResource.updateCompanyReceipt({ id: id }, payload).$promise;
    };

    var removeCompanyReceipt = function (id) {
      return requestResource.removeCompanyReceipt({ id: id }).$promise;
    };

    return {
      getCompanyReceipts: getCompanyReceipts,
      getCompanyReceipt: getCompanyReceipt,
      createCompanyReceipt: createCompanyReceipt,
      updateCompanyReceipt: updateCompanyReceipt,
      removeCompanyReceipt: removeCompanyReceipt
    };
  });
