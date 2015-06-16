'use strict';

/**
 * @ngdoc service
 * @name ts5App.companiesFactory
 * @description
 * # companiesFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('cashBagFactory', function (cashBagService, GlobalMenuService, stationsService, schedulesService) {
    var getCompanyId = function () {
      return GlobalMenuService.company.get();
    };

    var getCashBagList = function (id, optionalPayload) {
      if(arguments.length > 1) {
        return cashBagService.getCashBagList(id, optionalPayload);
      } else {
        return cashBagService.getCashBagList(id);
      }
    };

    var getStationList = function (id) {
      return stationsService.getStationList(id);
    };

    var getSchedulesList = function (id) {
      return schedulesService.getSchedules(id);
    };

    var getDailySchedulesList = function (id, scheduleNumber, scheduleDate) {
      return schedulesService.getDailySchedules(id, scheduleNumber, scheduleDate);
    };

    return {
      getCompanyId: getCompanyId,
      getCashBagList: getCashBagList,
      getStationList: getStationList,
      getSchedulesList: getSchedulesList,
      getDailySchedulesList: getDailySchedulesList
    };
  });
