'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualECSCtrl', function ($scope) {
    
    $scope.toggleActiveView = function (showCreateView) {
      $scope.isCreateViewActive = showCreateView;
    };

    function init() {
      $scope.isCreateViewActive = true;
    }

    init();

  });
