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
    var cashCompanyId = 0;
    var retailCompanyId = 0;
    var loadCompanySelection = function () {
      cashCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().id : 0;
      retailCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().chCompany.companyId : globalMenuService.company.get();
    };

    return {
      getAll: function () {
        loadCompanySelection();
        return $http.get(ENV.apiUrl + '/report-api/scheduleReport', { headers: { companyId: retailCompanyId, chCompanyId: cashCompanyId } });
      },

      getSchedule: function (scheduleReportId) {
        return $http.get(ENV.apiUrl + '/report-api/scheduleReport/' + scheduleReportId);
      },

      disableScheduled: function (scheduleReportId) {
        return $http.put(ENV.apiUrl + '/report-api/scheduleReport/' + scheduleReportId);
      }
    };
  });
