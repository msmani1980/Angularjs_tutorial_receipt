'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:eulaModal
 * @description
 * # eulaModal
 */
angular.module('ts5App')
  .directive('eulaModal', function() {

    var controller = function($scope) {

      var $this = this;

      this.hideModal = function() {
        var modal = angular.element('#eula-modal');
        modal.modal('hide');
      };

      $scope.confirmation = function() {
        $this.hideModal();
        $scope.confirmationCallback();
      };

      $scope.alternative = function() {
        $this.hideModal();
        $scope.alternativeCallback();
      };
    };

    return {
      templateUrl: '/views/directives/eula-modal.html',
      restrict: 'E',
      scope: {
        title: '@',
        body: '@',
        confirmationLabel: '@',
        confirmationCallback: '&',
        alternativeLabel: '@',
        alternativeCallback: '&',
        cancelLabel: '@'
      },
      controller: controller
    };

  });
