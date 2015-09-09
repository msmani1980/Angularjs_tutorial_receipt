'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:looseDataAlert
 * @description
 * # looseDataAlert
 */
angular.module('ts5App')
  .directive('looseDataAlert', function () {
    return {
      templateUrl: '/views/directives/loose-data-alert.html',
      restrict: 'E',
      scope: {
        title: '=',
        message: '=',
        showAlert: '=',
        confirmButtonText: '=',
        cancelButtonText: '=',
        confirmTrigger: '&',
        cancelTrigger: '&'
      },
      controller: function($scope, $location, $anchorScroll) {

        function hideAlert(){
          $scope.showAlertDialog = false;
          $scope.showAlert = false;
        }

        function showAlertDialog(newValue){
          if(newValue) {
            $scope.showAlert = false;
            $scope.showAlertDialog = true;
            $location.hash('loose-data-alert');
            $anchorScroll();
          }
          $location.hash('');
          return false;
        }

        function init() {
          hideAlert();
          if (!$scope.title) {
            $scope.title = 'Hold on!';
          }
          if (!$scope.message) {
            $scope.message = 'By taking this action, you might loose saved data, are you sure?';
          }
          if (!$scope.confirmButtonText) {
            $scope.confirmButtonText = 'Confirm';
          }
          if (!$scope.cancelButtonText) {
            $scope.cancelButtonText = 'Cancel';
          }
          $scope.$watch('showAlert', showAlertDialog, true);
        }
        init();

        $scope.hideAlert = function(){
          hideAlert();
        };

        $scope.callTrigger = function(trigger){
          hideAlert();
          if(angular.isUndefined($scope[trigger])) {
            return false;
          }
          var triggerReturn = $scope[trigger]();
          if(typeof triggerReturn !== 'boolean') {
            return false;
          }
          return triggerReturn;
        };

      }
    };
  });
