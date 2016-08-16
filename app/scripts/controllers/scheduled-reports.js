'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduledReportsCtrl
 * @description
 * # ScheduledReportsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduledReportsCtrl', function ($localStorage, $rootScope, $scope, $modal, scheduledReportsService, lodash, identityAccessFactory, globalMenuService) {

    $scope.scheduledReports = [];

    var updateScheduledReportsService = function () {
      scheduledReportsService.getAll().then(function (res) {
        $scope.scheduledReports = res.data;
      });
    };

    updateScheduledReportsService();

    $scope.viewScheduled = function (scheduledReport) {
      $modal.open({
        templateUrl: 'views/schedule-report.html',
        controller: 'ScheduleReportCtrl',
        backdrop: 'static',
        resolve: {
          templateId: function () {
            return scheduledReport.template.id;
          },

          scheduledReportId: function () {
            return scheduledReport.id;
          }
        }
      });
      
    };

    $scope.disableScheduled = function (scheduledReport) {
      scheduledReportsService.disableScheduled(scheduledReport.id).then(function (res) {
        return res;
      });
      
    };
    
    var featuresInRoleCollection = angular.copy($localStorage.featuresInRole.REPORT.REPORTINSTANCE);
    
    var companyTypeId = angular.fromJson(angular.toJson(identityAccessFactory.getSessionObject().companyData.companyTypeId));
  
    var baseCurrencyId = angular.fromJson(angular.toJson(identityAccessFactory.getSessionObject().companyData.baseCurrencyId));
   
    $scope.isTemplateInFeaturesInRole = function(template) { 
      var featuresInRoleMatch = lodash.findWhere(featuresInRoleCollection, { taskCode: template.code });
      return !!featuresInRoleMatch && (template.companyTypeId === companyTypeId) && (globalMenuService.getCompanyData().chCompany !== undefined ? (template.baseCurrencyId === baseCurrencyId || template.baseCurrencyId === 0) : true);
    };  
    
  });
