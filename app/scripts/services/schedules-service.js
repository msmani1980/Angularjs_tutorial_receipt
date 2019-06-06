'use strict';

/**
 * @ngdoc service
 * @name ts5App.schedulesService
 * @description
 * # schedulesService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('schedulesService', function($resource, ENV, Upload) {

    var schedulesRequestURL = ENV.apiUrl + '/rsvr/api/companies/:companyId/schedules/:id';

    var schedulesActions = {
      getSchedules: {
        method: 'GET',
        headers: {}
      },
      getDailySchedules: {
        method: 'GET',
        headers: {}
      },
      deleteSchedule: {
        method: 'DELETE',
        headers: {}
      },
      getScheduleById: {
        method: 'GET',
        headers: {}
      },
      createSchedule: {
        method: 'POST',
        headers: {}
      },
      updateSchedule: {
        method: 'PUT',
        headers: {}
      }
    };

    var distinctSchedulesRequestResource = $resource(ENV.apiUrl + '/rsvr/api/companies/:id/schedules/distinct', null, schedulesActions);
    var dailySchedulesRequestResource = $resource(schedulesRequestURL + '/daily', null, schedulesActions);
    var schedulesRequestResource = $resource(schedulesRequestURL, null, schedulesActions);

    var getSchedules = function(companyId, aditionalPayload) {
      var payload = {
        id: companyId
      };

      angular.extend(payload, aditionalPayload);

      schedulesActions.getSchedules.headers.companyId = companyId;
      return distinctSchedulesRequestResource.getSchedules(payload).$promise;
    };

    var getScheduleById = function(companyId, scheduleId) {
      var payload = {
        companyId: companyId,
        id: scheduleId
      };

      return schedulesRequestResource.getScheduleById(payload).$promise;
    };

    var getPeriodicSchedules = function(companyId, payload) {
      angular.extend(payload, {
        companyId: companyId
      });

      schedulesActions.getSchedules.headers.companyId = companyId;
      return schedulesRequestResource.getSchedules(payload).$promise;
    };

    var getDailySchedules = function(companyId, scheduleNumber, scheduleDate) {
      var payload = {
        companyId: companyId,
        scheduleNumber: scheduleNumber,
        scheduleDate: scheduleDate
      };

      return dailySchedulesRequestResource.getSchedules(payload).$promise;
    };

    var getSchedulesInDateRange = function(companyId, startDate, endDate, operationalDays) {
      var payload = {
        companyId: companyId,
        startDate: startDate,
        endDate: endDate,
        operationalDays: operationalDays
      };

      return schedulesRequestResource.getSchedules(payload).$promise;
    };

    var deleteSchedule = function (companyId, scheduleId) {
      var payload = {
        companyId: companyId,
        id: scheduleId
      };

      return schedulesRequestResource.deleteSchedule(payload).$promise;
    };

    var createSchedule = function (companyId, payload) {
      var requestParameters = {
        companyId: companyId
      };

      return schedulesRequestResource.createSchedule(requestParameters, payload).$promise;
    };

    var updateSchedule = function (companyId, scheduleId, payload) {
      var requestParameters = {
        companyId: companyId,
        id: scheduleId
      };

      return schedulesRequestResource.updateSchedule(requestParameters, payload).$promise;
    };

    var importFromExcel = function (companyId, file) {
      var uploadRequestURL = ENV.apiUrl + '/rsvr-upload/companies/' + companyId + '/file/schedule';
      return Upload.upload({
        url: uploadRequestURL,
        file: file
      });
    };

    return {
      getSchedules: getSchedules,
      getPeriodicSchedules: getPeriodicSchedules,
      getDailySchedules: getDailySchedules,
      getSchedulesInDateRange: getSchedulesInDateRange,
      importFromExcel: importFromExcel,
      deleteSchedule: deleteSchedule,
      getScheduleById: getScheduleById,
      createSchedule: createSchedule,
      updateSchedule: updateSchedule
    };

  });
