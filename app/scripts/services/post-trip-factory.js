'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('postTripFactory', function (GlobalMenuService, stationsService, carrierService, postTripService, employeesService) {
    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    var getPostTripDataList = function (id, payload) {
      if(arguments.length > 1) {
        return postTripService.getPostTrips(id, payload);
      } else {
        return postTripService.getPostTrips(id);
      }
    };

    var getPostTrip = function(id, tripId) {
      return postTripService.getPostTrip(id, tripId);
    };

    var createPostTrip = function (id, payload) {
      return postTripService.createPostTrip(id, payload);
    };

    var updatePostTrip = function (id, payload) {
      return postTripService.updatePostTrip(id, payload);
    };

    var deletePostTrip = function (id, tripId) {
      return postTripService.deletePostTrip(id, tripId);
    };

    var uploadPostTrip = function (id, file) {
      return postTripService.importFromExcel(id, file);
    };

    var getStationList = function (id) {
      var payload  = {companyId: id};
      return stationsService.getGlobalStationList(payload);
    };

    var getCarrierNumbers = function(id, carrierType) {
      return carrierService.getCarrierNumbers(id, carrierType);
    };

    var getCarrierTypes = function(id){
      return carrierService.getCarrierTypes(id);
    };

    var getEmployees = function(id){
      return employeesService.getEmployees(id);
    };

    return {
      getPostTripDataList: getPostTripDataList,
      getPostTrip: getPostTrip,
      createPostTrip: createPostTrip,
      updatePostTrip: updatePostTrip,
      deletePostTrip: deletePostTrip,
      uploadPostTrip: uploadPostTrip,
      getCompanyId: getCompanyId,
      getStationList: getStationList,
      getCarrierNumbers:getCarrierNumbers,
      getCarrierTypes:getCarrierTypes,
      getEmployees: getEmployees
    };
  });
