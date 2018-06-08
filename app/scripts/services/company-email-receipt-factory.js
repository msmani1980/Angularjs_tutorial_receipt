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
      return companyReceiptEmailService.getCompanyEmailReceipt(id);
    };

    this.getCompanyEmailReceipts = function (payload) {
      return companyReceiptEmailService.getCompanyEmailReceipts(payload);
    };

    this.createCompanyEmailReceipt = function (payload) {
      return companyReceiptEmailService.createCompanyEmailReceipt(payload);
    };

    this.updateCompanyEmailReceipt = function (id, payload) {
      return companyReceiptEmailService.updateCompanyEmailReceipt(id, payload);
    };

    this.removeCompanyEmailReceipt = function (id) {
      return companyReceiptEmailService.removeCompanyEmailReceipt(id);
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
