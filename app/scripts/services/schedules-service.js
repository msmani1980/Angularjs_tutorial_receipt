'use strict';

/**
 * @ngdoc service
 * @name ts5App.schedulesService
 * @description
 * # schedulesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('schedulesService', function ($resource, ENV) {

    var schedulesRequestURL = ENV.apiUrl + '/api/companies/:id/schedules';

    var schedulesActions = {
      getSchedules: {
        method: 'GET'
      },
      getDailySchedules: {
        method: 'GET'
      }
    };
    var distinctSchedulesRequestResource = $resource(schedulesRequestURL + '/distinct', null, schedulesActions);
    var dailySchedulesRequestResource = $resource(schedulesRequestURL + '/daily', null, schedulesActions);
    var schedulesRequestResource = $resource(schedulesRequestURL, null, schedulesActions);

    var getSchedules = function (companyId) {
      var payload = {id:companyId};
      return distinctSchedulesRequestResource.getSchedules(payload).$promise;
    };

    var getDailySchedules = function (companyId,scheduleNumber, scheduleDate) {
      var payload = {id:companyId,
        scheduleNumber:scheduleNumber,
        scheduleDate:scheduleDate
      };
      return dailySchedulesRequestResource.getSchedules(payload).$promise;
    };

    var getSchedulesInDateRange = function(companyId, startDate, endDate){
      var payload = {
        id:companyId,
        startDate:startDate,
        endDate:endDate
      };
      return schedulesRequestResource.getSchedules(payload).$promise;
    };

    return {
      getSchedules: getSchedules,
      getDailySchedules: getDailySchedules,
      getSchedulesInDateRange: getSchedulesInDateRange
    };

  });
