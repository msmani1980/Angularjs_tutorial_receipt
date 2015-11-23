'use strict';

/**
 * @ngdoc service
 * @name ts5App.commissionFactory
 * @description
 * # commissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('commissionFactory', function (commissionDataService, recordsService, GlobalMenuService) {

    var getCommissionPayableList = function (payload) {
      if(arguments.length > 0) {
        return commissionDataService.getCommissionPayableList(payload);
      } else {
        return commissionDataService.getCommissionPayableList();
      }
    };

    var getCommissionPayableData = function(id) {
      return commissionDataService.getCommissionPayableData(id);
    };

    var createCommissionData = function (payload) {
      return commissionDataService.createCommissionData(payload);
    };

    var updateCommissionData = function (id, payload) {
      return commissionDataService.updateCommissionData(id, payload);
    };

    var deleteCommissionData = function (id) {
      return commissionDataService.deleteCommissionData(id);
    };

    var getCommissionPayableTypes = function () {
      return recordsService.getCommissionPayableTypes();
    };

    var getDiscountTypes = function () {
      return recordsService.getDiscountTypes();
    };

    var getCompanyData = function () {
      return GlobalMenuService.getCompanyData();
    };

    return {
      getCommissionPayableList: getCommissionPayableList,
      getCommissionPayableData: getCommissionPayableData,
      createCommissionData: createCommissionData,
      updateCommissionData: updateCommissionData,
      deleteCommissionData: deleteCommissionData,
      getCommissionPayableTypes: getCommissionPayableTypes,
      getDiscountTypes: getDiscountTypes,
      getCompanyData: getCompanyData
    };
  });
