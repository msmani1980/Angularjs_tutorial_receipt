'use strict';

/**
 * @ngdoc service
 * @name ts5App.scheduledReportsService
 * @description
 * # scheduledReportsService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('scheduledReportsService', function ($http, ENV, globalMenuService) {
    return {
      getAll: function () {
        return $http.get(ENV.apiUrl + '/report-api/scheduleReport', { headers: { companyId: globalMenuService.company.get() } });
      },

      getSchedule: function (scheduleReportId) {
        return $http.get(ENV.apiUrl + '/report-api/scheduleReport/' + scheduleReportId);
      },

      disableScheduled: function (scheduleReportId) {
        return $http.put(ENV.apiUrl + '/report-api/scheduleReport/' + scheduleReportId);
      }
    };
  });
