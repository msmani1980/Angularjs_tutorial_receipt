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
      return schedulesService.getPeriodicSchedules(getCompanyId(), payload);
    };

    var getSchedule = function(scheduleId) {
      return schedulesService.getScheduleById(getCompanyId(), scheduleId);
    };

    var createSchedule = function (payload) {
      return schedulesService.createSchedule(getCompanyId(), payload);
    };

    var updateSchedule = function (payload) {
      return schedulesService.updateSchedule(getCompanyId(), payload.id, payload);
    };

    var deleteSchedule = function (companyId, scheduleId) {
      return schedulesService.deleteSchedule(companyId, scheduleId);
    };

    var getStationList = function (id, offset, payload) {
      if (offset) {
        return stationsService.getStationList(id, offset, payload);
      }

      return stationsService.getStationList(id, offset, payload);
    };

    var getCarrierNumbers = function(id, carrierType, payload) {
      return carrierService.getCarrierNumbers(id, carrierType, payload);
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
      getCompanyId: getCompanyId,
      getStationList: getStationList,
      getCarrierNumbers:getCarrierNumbers,
      getCarrierTypes:getCarrierTypes
    };
  });
