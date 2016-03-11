'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:eulaModal
 * @description
 * # eulaModal
 */
angular.module('ts5App')
  .directive('eulaModal', ['eulaService', function(eulaService) {

    function link(scope) {

      scope.showEULA = function() {
        console.log('here');
        eulaService.getCurrentEULA();
        angular.element('#eula-modal').modal('show');
      };
    }

    return {
      restrict: 'E',
      templateUrl: '/views/directives/eula-modal.html',
      link: link
    };
  }]);
