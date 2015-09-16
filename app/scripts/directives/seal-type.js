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
        return ($scope.sealTypeObject.seals.numbers.length === 1);
      };

      $scope.addSealsSequentially = function() {
        var sealNumber = parseInt($scope.sealTypeObject.seals.numbers[0]);
        var count = parseInt($scope.numberOfSeals + 1);
        for (var i = 1; i < count; i++) {
          var newSeal = Math.ceil(sealNumber + i);
          $scope.sealTypeObject.seals.numbers.push(newSeal);
        }
      };

      $scope.showClearButton = function() {
        return ($scope.sealTypeObject.seals.numbers.length > 1);
      };

      $scope.clearSeals = function() {
        $scope.sealTypeObject.seals.numbers = [];
      };  

    };
    return {
      templateUrl: '/views/directives/seal-type.html',
      controller: sealTypeController,
      scope: {
        sealTypeObject: '='
      }
    };
  });
