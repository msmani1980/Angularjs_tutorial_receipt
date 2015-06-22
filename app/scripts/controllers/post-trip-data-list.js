'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataListCtrl', function ($scope) {
    $scope.viewName = 'Post Trip Data Management';
    $scope.search = {};

    $scope.searchPostTripData = function() {
      // TODO: call API with search object
    };

    $scope.clearSearchForm = function() {
      $scope.search = {};
      // TODO: call API with empty search object
    }


});
