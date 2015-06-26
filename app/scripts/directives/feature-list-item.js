'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:listObject
 * @description
 * # listObject
 */
angular.module('ts5App')
  .directive('featureListItem', function () {
    function controller($scope/*, element, attrs*/) {
      // set attributes of directive to the scope to use in template
      $scope.isExpanded = false;

      $scope.toggleExpand = function() {
        $scope.isExpanded = !$scope.isExpanded;
      };
    }

    function templateUrl(element, attrs) {
      return 'views/directives/feature-list-item/' + attrs.type + '.html';
    }

    return {
      scope: {
        viewModel: '=',
        edit: '&',
        view: '&',
        func1: '&'
      },
      //  vm: '&listObject'
      //},
      restrict: 'E',
      controller: controller,
      templateUrl: templateUrl,
      transclude: true
    };
  });
