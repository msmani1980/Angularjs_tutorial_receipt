'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('postTripFactory', function (GlobalMenuService, stationsService, carrierService, postTripsService) {
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

    var createPostTrip = function (id, payload) {
      return postTripsService.createPostTrip(id, payload);
    }

    var getStationList = function (id) {
      return stationsService.getStationList(id);
    };

    var getCarrierNumbers = function(id, carrierType) {
      return carrierService.getCarrierNumbers(id, carrierType);
    };

    var getCarrierTypes = function(id){
      return carrierService.getCarrierTypes(id);
    };

    return {
      getPostTripDataList: getPostTripDataList,
      createPostTrip: createPostTrip,
      getCompanyId: getCompanyId,
      getStationList: getStationList,
      getCarrierNumbers:getCarrierNumbers,
      getCarrierTypes:getCarrierTypes
    };
  });
