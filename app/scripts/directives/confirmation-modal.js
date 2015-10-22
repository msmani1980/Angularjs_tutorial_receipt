'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:confirmationModal
 * @description
 * # confirmationModal
 */
angular.module('ts5App')
  .directive('confirmationModal', function () {

    var controller = function ($scope) {

      $scope.confirmation = function () {
        var modal = angular.element('#confirmation-modal');
        modal.modal('hide');
        $scope.confirmationCallback();
      };

    };

    return {
      templateUrl: '/views/directives/confirmation-modal.html',
      restrict: 'E',
      scope: {
        title: '@',
        body: '@',
        confirmationLabel: '@',
        confirmationCallback: '&',
        cancelLabel: '@',
      },
      controller: controller
    };

  });
