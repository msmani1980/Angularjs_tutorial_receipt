'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReportsCtrl', function ($rootScope, $scope, $modal, templateService, lodash) {

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
    
    var featuresInRoleCollection = angular.copy($rootScope.featuresInRole.REPORT.REPORT);    
    
    $scope.isTemplateInFeaturesInRole = function(templateCode) { 
      var featuresInRoleMatch = lodash.findWhere(featuresInRoleCollection, { taskCode: templateCode });
      return !!featuresInRoleMatch;
    };    
   
  });
