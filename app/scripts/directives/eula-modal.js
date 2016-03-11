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
        angular.element('#eula-modal').modal('show');
        if (!scope.eulaLoaded) {
          eulaService.getCurrentEULA().then(function() {
            scope.eulaLoaded = true;
          });
        }
      };
    }

    return {
      restrict: 'E',
      templateUrl: '/views/directives/eula-modal.html',
      link: link,
      replace: true
    };
  }]);
