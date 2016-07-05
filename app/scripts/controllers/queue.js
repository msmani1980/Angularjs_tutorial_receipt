'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:QueueCtrl
 * @description # QueueCtrl Controller of the ts5App
 */
angular.module('ts5App')
	.controller('QueueCtrl', function ($scope, jobService, $interval, ENV) {
	
  $scope.jobs = [];
	
  var updateQueue = function() {
    jobService.getAll().then(function(res) {
      $scope.jobs  = res.data;
    });
  };
	
  updateQueue();	
	
  var queueWatcher = $interval(updateQueue, 20000);
	
  $scope.$on('$destroy', function() {
    $interval.cancel(queueWatcher);
  });
	
  $scope.download = function(fileId) {
    window.open(ENV.apiUrl + '/report-api/reports/' + fileId);
  };
	
  $scope.delete = function(jobId) {
    jobService.delete(jobId).then(updateQueue);
  };

});
