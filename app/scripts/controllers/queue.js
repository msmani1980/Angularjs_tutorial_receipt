'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:QueueCtrl
 * @description # QueueCtrl Controller of the ts5App
 */
angular.module('ts5App')
  .controller('QueueCtrl', function ($localStorage, $rootScope, $scope, jobService, $interval, ENV, lodash, identityAccessFactory, globalMenuService) {

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

    $scope.download = function (fileId) {
      window.open(ENV.apiUrl + '/report-api/reports/' + fileId);
    };

    $scope.delete = function (jobId) {
      jobService.delete(jobId).then(updateQueue);
    };
    
    var featuresInRoleCollection = angular.copy($localStorage.featuresInRole.REPORT.REPORTINSTANCE);    
    
    var companyTypeId = angular.fromJson(angular.toJson(identityAccessFactory.getSessionObject().companyData.companyTypeId));
  
    var baseCurrencyId = angular.fromJson(angular.toJson(identityAccessFactory.getSessionObject().companyData.baseCurrencyId));
    
    $scope.isTemplateInFeaturesInRole = function(template) { 
      var featuresInRoleMatch = lodash.findWhere(featuresInRoleCollection, { taskCode: template.code });
      return !!featuresInRoleMatch && (template.companyTypeId === companyTypeId) && (globalMenuService.getCompanyData().chCompany !== undefined ? (template.baseCurrencyId === baseCurrencyId || template.baseCurrencyId === 0) : true);
    };
    
  });
