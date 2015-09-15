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

      $scope.seals = {
        numbers: []
      };

      $scope.isSequentialPossible = function() {
        return ($scope.seals.numbers.length === 1);
      };

      $scope.addSealsSequentially = function() {
        var sealNumber = parseInt($scope.seals.numbers[0]);
        var count = parseInt($scope.numberOfSeals + 1);
        for (var i = 1; i < count; i++) {
          var newSeal = Math.ceil(sealNumber + i);
          $scope.seals.numbers.push(newSeal);
        }
      };

      $scope.showClearButton = function() {
        return ($scope.seals.numbers.length > 1);
      };

      $scope.clearSeals = function() {
        $scope.seals.numbers = [];
      };

      $scope.showCopyFromOutbound = function(sealType) {
        return (sealType === 'HO' || sealType === 'IB');
      };

      $scope.showCopyFromHandover = function(sealType) {
        return (sealType === 'IB');
      };

      $scope.copyFromOutbound = function(sealType) {
        console.log('copyFromOutbound', sealType);
      };

      $scope.copyFromHandover = function(sealType) {
        console.log('copyFromHandover', sealType);
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
