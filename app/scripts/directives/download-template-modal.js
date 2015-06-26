'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:downloadTemplateModal
 * @description
 * # downloadTemplateModal
 */
angular.module('ts5App')
  .directive('downloadTemplateModal', function () {

    var downloadTemplateController = function ($scope, $location) {

      // Show leave view modal
      $scope.downloadTemplate = function (str) {

        var e = angular.element('#download-template-modal');

        var leavePath = str;

        $scope.leavePath = leavePath;

        //if the modal is hidden, and the location is not dashboard
        if (e.modal('hide') && $location.path() !== leavePath) {

          e.modal('show');

        } else {

          e.modal('hide');

          $location.path('/' + leavePath);
          $scope.$apply();

        }

        return leavePath;

      };

      $scope.downloadTemplateClose = function () {

        var e = angular.element('#download-template-modal');

        var leavePath = $scope.leavePath;

        e.modal('hide');

        e.on('hidden.bs.modal', function () {
          $location.path('/' + leavePath);
          $scope.$apply();
        });

      };

    };

    return {
      templateUrl: '/views/directives/download-template-modal.html',
      restrict: 'E',
      scope: false,
      controller: downloadTemplateController

    };

  });
