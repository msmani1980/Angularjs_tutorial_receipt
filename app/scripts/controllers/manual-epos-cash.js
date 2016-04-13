'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ManualEposCashCtrl
 * @description
 * # ManualEposCashCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ManualEposCashCtrl', function ($scope, manualEposFactory) {
    
    function init() {
      manualEposFactory.getCashList().then(function(response) {
        $scope.companyCashList = angular.copy(response);
      });
    }

    init();

  });
