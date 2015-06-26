'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:devFooter
 * @description
 * # devFooter
 */
angular.module('ts5App')
  .directive('devFooter', ['versionService', function (versionService) {

    function link(scope) {
      scope.getProjectInfo = function () {
        if (!scope.appInformation) {
          versionService.getProjectInfo().then(function (dataFromAPI) {
            scope.appInformation = dataFromAPI;
          });
        } else {
          scope.appInformation = false;
        }
      };
    }

    return {
      templateUrl: '/views/directives/dev-footer.html',
      restrict: 'E',
      replace: true,
      link: link
    };
  }]);
