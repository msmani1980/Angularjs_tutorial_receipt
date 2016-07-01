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
    var loadActionURL = function () {
      actions = {
        saveReport: {
          method: 'POST',
          headers: { companyId: globalMenuService.company.get() }
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
