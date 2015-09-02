'use strict';

/**
 * @ngdoc service
 * @name ts5App.commissionFactory
 * @description
 * # commissionFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('commissionFactory', function (GlobalMenuService, commissionDataService) {
    var getCommissionPayableList = function (payload) {
      if(arguments.length > 0) {
        return commissionDataService.getCommissionPayableList(payload);
      } else {
        return commissionDataService.getCommissionPayableList();
      }
    };
    //
    //var getPostTrip = function(id, tripId) {
    //  return postTripService.getPostTrip(id, tripId);
    //};
    //
    //var createPostTrip = function (id, payload) {
    //  return postTripService.createPostTrip(id, payload);
    //};
    //
    //var updatePostTrip = function (id, payload) {
    //  return postTripService.updatePostTrip(id, payload);
    //};
    //
    //var deletePostTrip = function (id, tripId) {
    //  return postTripService.deletePostTrip(id, tripId);
    //};
    //
    //var uploadPostTrip = function (id, file) {
    //  return postTripService.importFromExcel(id, file);
    //};
    //
    //var getStationList = function (id, offset) {
    //  if(offset) {
    //    return stationsService.getStationList(id, offset);
    //  }
    //  return stationsService.getStationList(id);
    //};
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
      getCommissionPayableList: getCommissionPayableList
    };
  });
