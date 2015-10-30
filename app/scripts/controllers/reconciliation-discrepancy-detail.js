'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDiscrepancyDetail
 * @description
 * # ReconciliationDiscrepancyDetailCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDiscrepancyDetail', function ($scope, $routeParams, ngToast, $location) {

    $scope.showModal = function () {
      angular.element("#t6Modal").modal('show');
    };

    $scope.switchModel = true;

    angular.element("#checkbox").bootstrapSwitch();


  });
