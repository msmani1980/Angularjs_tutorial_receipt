'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:leaveViewModal
 * @description
 * # leaveViewModal
 */
angular.module('ts5App')
  .directive('leaveViewModal', function () {

    var leaveViewController= function ($scope, $location) {

      // Show leave view modal
      $scope.leaveView = function() {

        var e = angular.element('#leave-view-modal');

        //if the modal is hidden, and the location is not dashboard
        if (e.modal('hide') && $location.path() === '/item-create'){

          e.modal('show');

        } else{

          e.modal('hide');
    
        }

      };

      $scope.leaveViewClose = function() {

        var e = angular.element('#leave-view-modal');

        e.modal('hide');

        e.on('hidden.bs.modal', function () {
          $location.path('/');
          $scope.$apply();
        });

      };

    };

    return {
    templateUrl: 'views/directives/leave-view-modal.html',
    restrict: 'E',
    scope: false,
    controller: leaveViewController

    };

  });