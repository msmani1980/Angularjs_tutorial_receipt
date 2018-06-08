'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyEmailReceiptService
 * @description
 * # companyEmailReceiptService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('companyEmailReceiptService', function (ENV, $resource) {
    var requestURL = ENV.apiUrl + '/rsvr/api/company-email-receipts/:id';
    var requestParameters = {
      id: '@id'
    };

    var actions = {
      getCompanyEmailReceipts: {
        method: 'GET'
      },
      getCompanyEmailReceipt: {
        method: 'GET'
      },
      createCompanyEmailReceipt: {
        method: 'POST'
      },
      updateCompanyEmailReceipt: {
        method: 'PUT'
      },
      removeCompanyEmailReceipt: {
        method: 'DELETE'
      }
    };

    var requestResource = $resource(requestURL, requestParameters, actions);

    var getCompanyEmailReceipts = function (payload) {
      return requestResource.getCompanyEmailReceipts(payload).$promise;
    };

    var getCompanyEmailReceipt = function (id) {
      return requestResource.getCompanyEmailReceipt({ id: id }).$promise;
    };

    var createCompanyEmailReceipt = function (payload) {
      return requestResource.createCompanyEmailReceipt(payload).$promise;
    };

    var updateCompanyEmailReceipt = function (id, payload) {
      return requestResource.updateCompanyEmailReceipt({ id: id }, payload).$promise;
    };

    var removeCompanyEmailReceipt = function (id) {
      return requestResource.removeCompanyEmailReceipt({ id: id }).$promise;
    };

    return {
      getCompanyEmailReceipts: getCompanyEmailReceipts,
      getCompanyEmailReceipt: getCompanyEmailReceipt,
      createCompanyEmailReceipt: createCompanyEmailReceipt,
      updateCompanyEmailReceipt: updateCompanyEmailReceipt,
      removeCompanyEmailReceipt: removeCompanyEmailReceipt
    };
  });
