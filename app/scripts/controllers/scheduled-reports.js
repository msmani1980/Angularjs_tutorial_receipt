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
        if (res.data !== undefined) {
          window.location.reload();
        }
      });
      
    };
    
    var featuresInRoleCollection = angular.copy($localStorage.featuresInRole.REPORT.REPORTINSTANCE);
    
    var companyTypeId = angular.fromJson(angular.toJson(identityAccessFactory.getSessionObject().companyData.companyTypeId));
  
    var baseCurrencyId = angular.fromJson(angular.toJson(identityAccessFactory.getSessionObject().companyData.baseCurrencyId));
   
    var isTypeIdSame = function (template) {
      return (template.companyTypeId === companyTypeId);
    };
    
    var isCompanyDateDefined = function (template) {
      return (globalMenuService.getCompanyData().chCompany !== undefined ? (template.baseCurrencyId === baseCurrencyId || template.baseCurrencyId === 0) : true);
    };
    
    $scope.isTemplateInFeaturesInRole = function(template) { 
      var featuresInRoleMatch = lodash.findWhere(featuresInRoleCollection, { taskCode: template.code });
      return !!featuresInRoleMatch && isTypeIdSame(template) && isCompanyDateDefined(template);
    };  
    
  });
