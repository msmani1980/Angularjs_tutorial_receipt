'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyEmailReceiptFactory
 * @description
 * # companyEmailReceiptFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companyEmailReceiptFactory', function (companyEmailReceiptService, globalMenuService) {
    this.getCompanyEmailReceipt = function (id) {
      return companyEmailReceiptService.getCompanyEmailReceipt(id);
    };

    this.getCompanyEmailReceipts = function (payload) {
      return companyEmailReceiptService.getCompanyEmailReceipts(payload);
    };

    this.createCompanyEmailReceipt = function (payload) {
      return companyEmailReceiptService.createCompanyEmailReceipt(payload);
    };

    this.updateCompanyEmailReceipt = function (id, payload) {
      return companyEmailReceiptService.updateCompanyEmailReceipt(id, payload);
    };

    this.removeCompanyEmailReceipt = function (id) {
      return companyEmailReceiptService.removeCompanyEmailReceipt(id);
    };

    this.getCompanyId = function () {
      return globalMenuService.company.get();
    };

    return {
      getCompanyEmailReceipt: this.getCompanyEmailReceipt,
      getCompanyEmailReceipts: this.getCompanyEmailReceipts,
      createCompanyEmailReceipt: this.createCompanyEmailReceipt,
      updateCompanyEmailReceipt: this.updateCompanyEmailReceipt,
      removeCompanyEmailReceipt: this.removeCompanyEmailReceipt,
      getCompanyId: this.getCompanyId
    };
  });
