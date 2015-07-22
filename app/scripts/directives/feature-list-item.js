'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:listObject
 * @description
 * # listObject
 */
angular.module('ts5App')
  .controller('FeatureListCtrl', function ($scope/*, element, attrs*/) {
    $scope.isExpanded = false;

    $scope.toggleExpand = function() {
      $scope.isExpanded = !$scope.isExpanded;
    };
  })
  .directive('featureListItem', function () {

    function templateUrl(element, attrs) {
      return 'views/directives/feature-list-item.' + attrs.type + '.html';
    }

    return {
      scope: {
        viewModel: '='
      },
      restrict: 'E',
      controller: 'FeatureListCtrl',
      templateUrl: templateUrl,
      transclude: true
    };
  });
