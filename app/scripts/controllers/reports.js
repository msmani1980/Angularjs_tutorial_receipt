'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReportsCtrl', function ($localStorage, $rootScope, $scope, $modal, templateService, lodash, identityAccessFactory, globalMenuService) {

    $scope.templates = templateService.query();

    $scope.runTemplate = function (template) {
      $scope.template = template;
      $modal.open({
        templateUrl: 'views/report-options.html',
        controller: 'ReportOptionsCtrl',
        backdrop: 'static',
        resolve: {
          templateId: function () {
            return template.id;
          }
        }
      });
    };

    $scope.runSchedule = function (template) {
      $modal.open({
        templateUrl: 'views/schedule-report.html',
        controller: 'ScheduleReportCtrl',
        backdrop: 'static',
        resolve: {
          templateId: function () {
            return template.id;
          },

          scheduledReportId: function () {
            return '';
          }
        }
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
