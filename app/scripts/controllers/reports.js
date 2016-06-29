'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReportsCtrl
 * @description
 * # ReportsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReportsCtrl', function ($scope, $modal, templateService) {
	  
    $scope.templates = templateService.query();
    
    $scope.runTemplate = function (template) {
    $scope.template=template;
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
    
    $scope.runSchedule = function(template) {
        $modal.open({
                  templateUrl: 'views/schedule-report.html',
                  controller: 'ScheduleReportCtrl',
                  backdrop: 'static',
                  resolve: {
                     templateId: function () {
                         return template.id;
                       },
                       scheduledReportId: function () {
	                        return "";
	                   }
                 }
              });
     };
     
  });
