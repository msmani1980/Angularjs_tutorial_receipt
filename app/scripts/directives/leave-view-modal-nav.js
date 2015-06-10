'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:leaveViewModal
 * @description
 * # leaveViewModal
 */
angular.module('ts5App')
  .directive('leaveViewModalNav', function () {

    var leaveViewNavController = function ($scope, $location) {

      // Show leave view modal
      $scope.leaveViewNav = function (str) {

        var e = angular.element('#leave-view-modal-nav');

        var leavePathNav = str;

        $scope.leavePathNav = leavePathNav;

        //if the modal is hidden, and the location is not dashboard
        if (e.modal('hide') && $location.path() !== leavePathNav) {

          e.modal('show');

        } else {

          e.modal('hide');

          $location.path(leavePathNav);
          $scope.$apply();

        }

        return leavePathNav;

      };

      $scope.leaveViewClose = function () {

        var e = angular.element('#leave-view-modal-nav');

        var leavePathNav = $scope.leavePathNav;

        e.modal('hide');

        e.on('hidden.bs.modal', function () {
          $location.path(leavePathNav);
          $scope.$apply();
        });

      };

    };

    return {
      templateUrl: '/views/directives/leave-view-modal-nav.html',
      restrict: 'E',
      scope: false,
      controller: leaveViewNavController

    };

  });
