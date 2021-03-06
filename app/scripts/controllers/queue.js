'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:QueueCtrl
 * @description # QueueCtrl Controller of the ts5App
 */
angular.module('ts5App')
  .controller('QueueCtrl', function ($localStorage, $rootScope, $scope, jobService, $interval, ENV, lodash, identityAccessFactory, globalMenuService, $modal) {

    $scope.jobs = [];

    var updateQueue = function () {
      jobService.getAll().then(function (res) {
        $scope.jobs = res.data;
      });
    };

    updateQueue();

    var queueWatcher = $interval(updateQueue, 20000);

    $scope.$on('$destroy', function () {
      $interval.cancel(queueWatcher);
    });

    $scope.download = function (fileId, jobId) {
      var sessionToken = identityAccessFactory.getSessionObject().sessionToken;
      window.open(ENV.apiUrl + '/report-api/reports/' + fileId + '?jobId=' + jobId + '&sessionToken=' + sessionToken);
    };
    
    $scope.reRunTemplate = function (existingJob) {
      $scope.template = existingJob.template;
      $modal.open({
          templateUrl: 'views/report-options.html',
          controller: 'ReportOptionsCtrl',
          backdrop: 'static',
          resolve: {
            templateId: function () {
              return existingJob.template.id;
            },
            
            reRunExistingJobReport: function () {
              return existingJob;
            }
            
          }
        });
    };

    $scope.delete = function (jobId) {
      jobService.delete(jobId).then(updateQueue);
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
    
    $scope.requestParamTooltip = function (params) {
      var paramString = '<div class="param-header"><i class="fa fa-tags"></i><span class="hidden-xs">Report Parameters</span>';
      paramString += '<li><span><strong>Company Name : </strong>' + identityAccessFactory.getSessionObject().companyData.companyName + '</span></li>';
      angular.forEach(params, function(value, key) {
        value = (value === 'No filter' ? 'All' : value);
        paramString += '<li><span><strong>' + key + ' : </strong>' + value + '</span></li>';
      });

      paramString += '</div>';
      return paramString;
    };
    
  }).directive('tooltipReportPopup', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
        templateUrl: 'views/directives/report-param-tooltip.html'
      };
  }).directive('tooltipReport', ['$tooltip', function ($tooltip) {
    return $tooltip('tooltipReport', 'tooltip', 'focus');
  }]);
