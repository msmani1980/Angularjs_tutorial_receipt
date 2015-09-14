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

      $scope.isSequentialPossible = function() {
        if ($scope.seals.numbers.length === 1) {
          return true;
        }
        return false;
      };

    };
    return {
      templateUrl: '/views/directives/seal-type.html',
      controller: sealTypeController,
      scope: {
        sealTypeObject: '=',
        sealColor: '='
      }
    };
  });
