'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:menuSlide
 * @description
 * # menuSlide
 */
angular.module('ts5App')
  .directive('menuSlide', function () {
    function link() {

    }

    return {
      templateUrl: '/views/directives/menu-slide.html',
      replace: true,
      restrict: 'E',
      link: link
    };
  });
