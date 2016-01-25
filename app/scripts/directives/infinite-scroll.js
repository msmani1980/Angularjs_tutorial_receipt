'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:infiniteScroll
 * @description
 * # infiniteScroll
 */
angular.module('ts5App')
  .directive('infiniteScroll', function ($rootScope, $window, lodash) {
    return {
      link: function (scope, elem, attrs) {

        var loadData;
        var scrollTrigger = 0.80;
        var scrollEnabled = true;
        var firstTime = true;
        $window = angular.element($window);

        if (attrs.infiniteNoScroll !== null) {
          scope.$watch(attrs.infiniteNoScroll, function (value) {
            scrollEnabled = (value !== true);
          });
        }

        if ((attrs.infiniteScrollTrigger) && (attrs.infiniteScrollTrigger > 0 && attrs.infiniteScrollTrigger < 100)) {
          scrollTrigger = attrs.infiniteScrollTrigger / 100;
        }

        loadData = lodash.debounce(function () {
          var wintop = window.pageYOffset;
          var docHeight = window.document.body.clientHeight;
          var windowHeight = window.innerHeight; //$window.height();
          var triggered = (wintop / (docHeight - windowHeight));

          if ((scrollEnabled) && (triggered >= scrollTrigger)) {
            return scope.$apply(attrs.infiniteScroll);
          }

          if (firstTime && !attrs.infiniteScrollImmediateCheck) {
            firstTime = false;
            return scope.$apply(attrs.infiniteScroll);
          }

        }, 150);

        if (firstTime && !attrs.infiniteScrollImmediateCheck) {
          loadData();
        }

        $window.on('scroll', loadData);
        scope.$on('$destroy', function () {
          return $window.off('scroll', loadData);
        });
      }
    };
  });
