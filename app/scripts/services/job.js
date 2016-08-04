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
	var cashCompanyId = 0;
	var retailCompanyId = 0;
	var loadCompanySelection = function(){
		cashCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().id : 0;
		retailCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().chCompany.companyId : globalMenuService.company.get();
	}
	
    return {
      run: function (templateId, params) {
    	  loadCompanySelection();
        return $http.post(ENV.apiUrl + '/report-api/templates/' + templateId + '/run', params, { headers: {  companyId: retailCompanyId, chCompanyId: cashCompanyId } });
      },

      schedule: function (templateId, params) {
    	  loadCompanySelection();
        return $http.post(ENV.apiUrl + '/report-api/scheduleReport/' + templateId, params, { headers: {  companyId: retailCompanyId, chCompanyId: cashCompanyId } });
      },

      getAll: function () {
    	  loadCompanySelection();
        return $http.get(ENV.apiUrl + '/report-api/jobs', { headers: { companyId: retailCompanyId, chCompanyId: cashCompanyId } });
      },

      delete: function (jobId) {
    	  loadCompanySelection();
        return $http.delete(ENV.apiUrl + '/report-api/jobs/' + jobId, { headers: {  companyId: retailCompanyId, chCompanyId: cashCompanyId } });
      }
    };
  });
