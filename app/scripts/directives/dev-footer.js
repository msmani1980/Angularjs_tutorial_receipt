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
        versionService.getProjectInfo().then(function (dataFromAPI) {
          scope.appInformation = dataFromAPI;
        });
      };
    }

    return {
      templateUrl: '/views/directives/dev-footer.html',
      restrict: 'E',
      replace: true,
      link: link
    };
  }]);
