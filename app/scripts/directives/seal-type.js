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

      $scope.seals = {};
      $scope.seals.numbers = [];
      $scope.seals.color = $scope.sealColor;

      $scope.isSequentialPossible = function() {
        if ($scope.seals.numbers.length === 1) {
          return true;
        }
        return false;
      };

      $scope.addSealsSequentially = function() {
        var sealNumber = $scope.seals.numbers[0];
        var numberOfSeals = $scope.numberOfSeals;
        console.log(sealNumber, numberOfSeals);
      };

    };
    return {
      templateUrl: '/views/directives/seal-type.html',
      controller: sealTypeController,
      scope: {
        sealTypeObject: '=',
        sealColor: '@'
      }
    };
  });
