'use strict';

/**
 * @ngdoc service
 * @name ts5App.commissionFactory
 * @description
 * # commissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('commissionFactory', function (commissionDataService) {

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

    //
    //var getCarrierNumbers = function(id, carrierType) {
    //  return carrierService.getCarrierNumbers(id, carrierType);
    //};
    //
    //var getCarrierTypes = function(id){
    //  return carrierService.getCarrierTypes(id);
    //};
    //
    //var getEmployees = function(id){
    //  return employeesService.getEmployees(id);
    //};
    //
    //var getSchedules = function (id) {
    //  return schedulesService.getSchedules(id);
    //};

    return {
      getCommissionPayableList: getCommissionPayableList,
      getCommissionPayableData: getCommissionPayableData,
      createCommissionData: createCommissionData,
      updateCommissionData: updateCommissionData,
      deleteCommissionData: deleteCommissionData
    };
  });
