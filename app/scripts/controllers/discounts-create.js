'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:DiscountsCreateCtrl
 * @description
 * # DiscountsCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('DiscountsCreateCtrl', function ($scope) {
    var $this = this;

    $scope.viewName = 'Create Discount';
    $scope.buttonText = 'Create';
    $scope.editingItem = false;
    $scope.uiSelectTemplateReady = true;

    $scope.isDisabled = function() {
      return false;
    };
  });
