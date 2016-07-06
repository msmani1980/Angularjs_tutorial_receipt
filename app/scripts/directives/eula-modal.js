'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:eulaModal
 * @description
 * # eulaModal
 */
angular.module('ts5App')
  .directive('eulaModal', ['eulaService', function (eulaService) {

    function link(scope) {

      function getEULAFromAPI() {
        if (scope.eulaLoaded) {
          return;
        }
        
        eulaService.getCurrentEULA().then(function () {
          scope.eulaLoaded = true;
        });
      }

      scope.showEULA = function () {
        angular.element('#eula-modal').modal('show');
        getEULAFromAPI();
      };
    }

    return {
      restrict: 'E',
      templateUrl: '/views/directives/eula-modal.html',
      link: link,
      replace: true
    };
  }]);
