'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:devFooter
 * @description
 * # devFooter
 */
angular.module('ts5App')
  .directive('devFooter', ['versionService', function (versionService) {
    function getProjectInfo() {
      versionService.getProjectInfo();
    }

    function link(scope, element) {
      scope.getProjectInfo = getProjectInfo;
    }

    return {
      templateUrl: '/views/directives/dev-footer.html',
      restrict: 'E',
      replace: true,
      link: link
    };
  }]);
