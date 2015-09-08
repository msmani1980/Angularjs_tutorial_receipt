'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstanceReviewCtrl
 * @description
 * # StoreInstanceReviewCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('StoreInstanceReviewCtrl', function ($scope, $routeParams, storeInstanceDispatchWizardConfig,
                                                   storeInstanceFactory) {

    function resolveGetStoreDetails(response) {
      $scope.storeDetails = response;
    }

    function init() {
      $scope.storeId = $routeParams.storeId;
      $scope.wizardSteps = storeInstanceDispatchWizardConfig.getSteps($scope.storeId);
      storeInstanceFactory.getStoreDetails($scope.storeId).then(resolveGetStoreDetails);
    }
    init();

  });
