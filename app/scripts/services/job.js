'use strict';

/**
 * @ngdoc service
 * @name ts5App.job
 * @description
 * # job
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('jobService', function ($http, globalMenuService, ENV) {
    return {
      run: function(templateId, params) {
        return $http.post(ENV.apiUrl + '/report-api/templates/' + templateId + '/run', params, { headers:{ companyId:globalMenuService.company.get() } });
      },

      schedule: function(templateId, params) {
          return $http.post(ENV.apiUrl + '/report-api/scheduleReport/' + templateId, params, { headers:{ companyId:globalMenuService.company.get() } });
        },

      getAll: function() {
        var jobs = $http.get(ENV.apiUrl + '/report-api/jobs', { headers:{ companyId:globalMenuService.company.get() } });
        return jobs;
      },

      delete: function(jobId) {
        return $http.delete(ENV.apiUrl + '/report-api/jobs/' + jobId, { headers:{ companyId:globalMenuService.company.get() } });
      }
    };
  });
