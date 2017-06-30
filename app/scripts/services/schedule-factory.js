'use strict';

/**
 * @ngdoc service
 * @name ts5App.scheduleFactory
 * @description
 * # scheduleFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('scheduleFactory',  function (globalMenuService, stationsService, carrierService, schedulesService) {
    var getCompanyId = function () {
      return globalMenuService.company.get();
    };

    var getSchedules = function (payload) {
      // TODO: add payload support for filtering
      return schedulesService.getSchedules(getCompanyId());
    };

    var getSchedule = function(id) {
      return null;
    };

    var createSchedule = function (id, payload) {
      return null;
    };

    var updateSchedule = function (id, payload) {
      return null;
    };

    var deleteSchedule = function (id, tripId) {
      return null;
    };

    var uploadSchedule = function (id, file) {
      return null;
    };

    var getStationList = function (id, offset) {
      if (offset) {
        return stationsService.getStationList(id, offset);
      }

      return stationsService.getStationList(id);
    };

    var getCarrierNumbers = function(id, carrierType) {
      return carrierService.getCarrierNumbers(id, carrierType);
    };

    var getCarrierTypes = function(id) {
      return carrierService.getCarrierTypes(id);
    };

    return {
      getSchedules: getSchedules,
      getSchedule: getSchedule,
      createSchedule: createSchedule,
      updateSchedule: updateSchedule,
      deleteSchedule: deleteSchedule,
      uploadSchedule: uploadSchedule,
      getCompanyId: getCompanyId,
      getStationList: getStationList,
      getCarrierNumbers:getCarrierNumbers,
      getCarrierTypes:getCarrierTypes
    };
  });
