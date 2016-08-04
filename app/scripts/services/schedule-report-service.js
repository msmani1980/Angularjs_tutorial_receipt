'use strict';

/**
 * @ngdoc service
 * @name ts5App.scheduleReportService
 * @description
 * # scheduleReportService
 * Service in the ts5App.
 */
angular.module('ts5App')
  .service('scheduleReportService', function ($resource, ENV, globalMenuService) {
    var reportsURL = ENV.apiUrl + '/report-api/scheduleReport/:templateId';
    var actions = [];
    var cashCompanyId = 0;
	var retailCompanyId = 0;
	
    var loadActionURL = function () {
    	
      cashCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().id : 0;
      retailCompanyId = (globalMenuService.getCompanyData().chCompany !== undefined) ? globalMenuService.getCompanyData().chCompany.companyId : 	globalMenuService.company.get();
      
      actions = {
        saveReport: {
          method: 'POST',
          headers: {  companyId: retailCompanyId, chCompanyId: cashCompanyId }
        }
      };
    };

    loadActionURL();

    var requestParameters = { templateId: '@templateId' };

    var saveReport = function (payload) {
      loadActionURL();
      var scheduleResource = $resource(reportsURL, requestParameters, actions);
      return scheduleResource.saveReport(payload).$promise;
    };

    return {
      saveReport: saveReport
    };
  });
