'use strict';

/**
 * @ngdoc directive
 * @name ts5App.directive:sealType
 * @description
 * # sealType
 */
angular.module('ts5App')
  .directive('sealType', function() {
    var sealTypeController = function($scope) {

      $scope.isSequentialPossible = function() {
        return ($scope.sealTypeObject.seals.numbers.length === 1 && $scope.sealTypeObject.seals.numbers[0] >= 0);
      };

      $scope.addSealsSequentially = function() {
        var sealNumber = parseInt($scope.sealTypeObject.seals.numbers[0]);
        var count = parseInt($scope.numberOfSeals + 1);
        for (var i = 1; i < count; i++) {
          var newSeal = Math.abs(sealNumber + i);
          $scope.sealTypeObject.seals.numbers.push(newSeal);
        }
      };

      $scope.showClearButton = function() {
        return ($scope.sealTypeObject.seals.numbers.length > 1);
      };

      $scope.clearSeals = function() {
        $scope.sealTypeObject.seals.numbers = [];
      };

      $scope.isAddButtonDisabled = function() {
        return ($scope.numberOfSeals > 100 || $scope.numberOfSeals < 1);
      };

      $scope.limitSealsInput = function() {
        var selector = 'input.ui-select-search';
        var input = angular.element(selector);
        angular.element(input).attr('maxlength', 15);
      };

    };
    return {
      templateUrl: '/views/directives/seal-type.html',
      controller: sealTypeController,
      scope: {
        sealTypeObject: '='
      },
      link: function($scope, $element) {
        $element.ready(function() {
          $scope.limitSealsInput();
        });
      }
    };
  });
