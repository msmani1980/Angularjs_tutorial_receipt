'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduledReportsCtrl
 * @description
 * # ScheduledReportsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduledReportsCtrl', function ($localStorage, $rootScope, $scope, $modal, scheduledReportsService, lodash) {

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
    
    var featuresInRoleCollection = angular.copy($localStorage.featuresInRole.REPORT.REPORT);    
    
    $scope.isTemplateInFeaturesInRole = function(templateCode) { 
      var featuresInRoleMatch = lodash.findWhere(featuresInRoleCollection, { taskCode: templateCode });
      return !!featuresInRoleMatch;
    };  
    
  });
