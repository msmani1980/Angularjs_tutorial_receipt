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

      var $this = this;

      this.hideModal = function() {
        var modal = angular.element('#confirmation-modal');
        modal.modal('hide');
      };

      $scope.confirmation = function () {
        $this.hideModal();
        $scope.confirmationCallback();
      };

      $scope.alternative = function () {
        $this.hideModal();
        $scope.alternativeCallback();
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
        alternativeLabel: '@',
        alternativeCallback: '&',
        cancelLabel: '@',
      },
      controller: controller
    };

  });
