'use strict';
/*global moment*/

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionCtrl
 * @description
 * # EmployeeCommissionCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionCtrl', function ($scope) {

    $scope.viewName = 'Employee Commission';

    $scope.startDate = moment().add(1, 'days').format('L').toString();
    //$scope.endDate = moment().format('L').toString();

  });
