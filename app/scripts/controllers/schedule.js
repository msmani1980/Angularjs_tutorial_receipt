'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ScheduleCtrl
 * @description
 * # ScheduleCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ScheduleCtrl', function ($scope, scheduleFactory, $location, $routeParams, messageService, lodash, $q) {
    var companyId;
    var $this = this;

    $scope.viewName = 'Schedule';
    $scope.readOnly = false;


  });
