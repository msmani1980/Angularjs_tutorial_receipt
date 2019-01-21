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

      var $this = this;
      $scope.taggingLabel = '(Add \'New\' Seal)';

      $scope.$watch('sealTypeObject.seals.numbers', function (newSealNumbers, oldSealNumbers) {
        if (newSealNumbers.length !== oldSealNumbers.length) {
          var normalizedSealNumbers = $scope.sealTypeObject.seals.numbers.map(function (sealNumber) {
            return $this.extractNumber(sealNumber.replace($scope.taggingLabel, ''));
          });

          $scope.sealTypeObject.seals.numbers = normalizedSealNumbers;
        }
      });

      this.extractNumber = function (value) {
        var number = value.match(/\d/g);
        return number.join('');
      };

      $scope.isSequentialPossible = function() {
        if ($scope.$parent.readOnly) {
          return false;
        }

        return ($scope.sealTypeObject.seals.numbers.length === 1 && $scope.sealTypeObject.seals.numbers[0] >= 0);
      };

      $scope.addSealsSequentially = function() {
        var sealNumber = parseInt($scope.sealTypeObject.seals.numbers[0]);
        var count = parseInt($scope.numberOfSeals);
        for (var i = 1; i < count; i++) {
          var newSeal = Math.abs(sealNumber + i).toString();
          $scope.sealTypeObject.seals.numbers.push(newSeal);
        }

        $scope.numberOfSeals = null;
      };

      $scope.showClearButton = function() {
        if ($scope.$parent.readOnly) {
          return false;
        }

        return ($scope.sealTypeObject.seals.numbers.length > 1);
      };

      $scope.clearSeals = function() {
        $scope.sealTypeObject.seals.numbers = [];
      };

      $scope.isAddButtonDisabled = function() {
        return ($scope.numberOfSeals > 100 || $scope.numberOfSeals < 2);
      };

      $scope.limitSealsInput = function() {
        var selector = 'input.ui-select-search';
        var input = angular.element(selector);
        angular.element(input).attr('maxlength', 15);
      };

      $scope.disabledAndNoSeals = function() {
        return ($scope.$parent.readOnly && $scope.sealTypeObject.seals.numbers.length < 1);
      };

      $scope.isReadOnly = function() {
        return $scope.$parent.readOnly;
      };

      $scope.addSealsSequentiallyWithEnter = function(keyEvent) {
        if (keyEvent.which === 13) {
          $scope.addSealsSequentially();
        }

        return false;
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
