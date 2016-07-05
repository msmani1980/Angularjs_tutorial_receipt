'use strict';

/**
 * @ngdoc service
 * @name ts5App.scheduledReportsService
 * @description
 * # scheduledReportsService
 * Service in the ts5App.
 */
angular.module('ts5App')
<<<<<<< HEAD
	.service('scheduledReportsService', function ($http, ENV, globalMenuService) {
  return {
    getAll: function() {
      var scheduledReports = $http.get(ENV.apiUrl + '/report-api/scheduleReport', { headers:{ companyId:globalMenuService.company.get() } });
      return scheduledReports;
    },

    getSchedule: function(scheduleReportId) {
      var scheduleReport = $http.get(ENV.apiUrl + '/report-api/scheduleReport/' + scheduleReportId);
      return scheduleReport;
    },

    disableScheduled: function(scheduleReportId) {
      var scheduleReport = $http.put(ENV.apiUrl + '/report-api/scheduleReport/' + scheduleReportId);
      return scheduleReport;
    }
  };
});
=======
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
>>>>>>> remotes/origin/master
