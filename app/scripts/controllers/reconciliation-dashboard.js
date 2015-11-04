'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:ReconciliationDashboardCtrl
 * @description
 * # ReconciliationDashboardCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ReconciliationDashboardCtrl', function ($scope) {

    $scope.viewName = 'Reconciliation Dashboard';
    $scope.search = {};
    $scope.multiSelectedValues = {};

    $scope.showCreatePopup = function () {
      angular.element('#reconciliationModal').modal('show');
    };

    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
