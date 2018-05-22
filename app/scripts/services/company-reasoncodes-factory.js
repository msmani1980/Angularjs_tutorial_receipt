'use strict';

/**
 * @ngdoc service
 * @name ts5App.companyReasoncodesFactory
 * @description
 * # companyReasoncodesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('companyReasoncodesFactory', function (globalMenuService, companyReasonCodesService) {

    var getCompanyId = function () {
      return globalMenuService.company.get();
    };

    var getCompanyReasonCodes = function (payload) {
      return companyReasonCodesService.getCompanyReasonCodes(payload);
    };

    var getReasonTypes = function () {
      return companyReasonCodesService.getReasonTypes();
    };

    var getCompanyReasonCode = function(reasonId) {
      return companyReasonCodesService.getCompanyReasonCodeById(reasonId);
    };

    var createCompanyReasonCode = function (payload) {
      return companyReasonCodesService.createCompanyReasonCode(payload);
    };

    var updateCompanyReasonCode = function (payload) {
      return companyReasonCodesService.updateCompanyReasonCode(payload.id, payload);
    };

    var deleteCompanyReasonCode = function (reasonId) {
      return companyReasonCodesService.deleteCompanyReasonCode(reasonId);
    };

    return {
      getCompanyReasonCodes: getCompanyReasonCodes,
      getReasonTypes: getReasonTypes,
      getCompanyReasonCode: getCompanyReasonCode,
      createCompanyReasonCode: createCompanyReasonCode,
      updateCompanyReasonCode: updateCompanyReasonCode,
      deleteCompanyReasonCode: deleteCompanyReasonCode,
      getCompanyId: getCompanyId
    };

  });
