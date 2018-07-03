'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReceiptFactory
 * @description
 * # companyReceiptFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companyReceiptFactory', function (companyReceiptService, globalMenuService) {
    this.getCompanyReceipt = function (id) {
      return companyReceiptService.getCompanyReceipt(id);
    };

    this.getCompanyReceipts = function (payload) {
      return companyReceiptService.getCompanyReceipts(payload);
    };

    this.createCompanyReceipt = function (payload) {
      return companyReceiptService.createCompanyReceipt(payload);
    };

    this.updateCompanyReceipt = function (id, payload) {
      return companyReceiptService.updateCompanyReceipt(id, payload);
    };

    this.removeCompanyReceipt = function (id) {
      return companyReceiptService.removeCompanyReceipt(id);
    };

    this.getCompanyId = function () {
      return globalMenuService.company.get();
    };

    return {
      getCompanyReceipt: this.getCompanyReceipt,
      getCompanyReceipts: this.getCompanyReceipts,
      createCompanyReceipt: this.createCompanyReceipt,
      updateCompanyReceipt: this.updateCompanyReceipt,
      removeCompanyReceipt: this.removeCompanyReceipt,
      getCompanyId: this.getCompanyId
    };
  });
