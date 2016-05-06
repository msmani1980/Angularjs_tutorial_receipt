'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposEntryCtrl
 * @description
 * # ManualEposEntryCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposEntryCtrl', function($scope, $q, manualEposFactory, $location, $routeParams) {

    $scope.navigateToForm = function (formName) {
      $location.path('manual-epos-' + formName + '/' + $routeParams.cashBagId);
    };

    $scope.isFormVerified = function (formName) {
      return formName === 'cash';
    };

    function init() {
      $scope.viewName = 'Manual ePOS Data Entry';
      $scope.cashBagId = $routeParams.cashBagId;
    }

    init();
  });
