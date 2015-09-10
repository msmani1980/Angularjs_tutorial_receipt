'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceSealsCtrl
 * @description
 * # StoreInstanceSealsCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceSealsCtrl', function ($scope,storeInstanceDispatchWizardConfig, $routeParams) {

    $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps();
    $scope.storeId = $routeParams.id;

  });
