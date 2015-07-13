'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('postTripFactory', function (GlobalMenuService, stationsService, carrierService, postTripsService, employeesService) {
    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    var getPostTripDataList = function (id, payload) {
      if(arguments.length > 1) {
        return postTripsService.getPostTrips(id, payload);
      } else {
        return postTripsService.getPostTrips(id);
      }
    };

    var getPostTrip = function(id, tripId) {
      return postTripsService.getPostTrip(id, tripId);
    };

    var createPostTrip = function (id, payload) {
      return postTripsService.createPostTrip(id, payload);
    };

    var updatePostTrip = function (id, payload) {
      return postTripsService.updatePostTrip(id, payload);
    };

    var deletePostTrip = function (id, tripId) {
      return postTripsService.deletePostTrip(id, tripId);
    };

    var getStationList = function (id) {
      return stationsService.getStationList(id);
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
      getCompanyId: getCompanyId,
      getStationList: getStationList,
      getCarrierNumbers:getCarrierNumbers,
      getCarrierTypes:getCarrierTypes,
      getEmployees: getEmployees
    };
  });
