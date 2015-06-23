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
  .controller('EmployeeCommissionCtrl', function ($scope, employeeCommissionFactory) {

    $scope.viewName = 'Employee Commission';
    $scope.startDate = moment().add(1, 'days').format('L').toString();

    employeeCommissionFactory.getItemsList({}).then(function(dataFromAPI) {
      $scope.itemsList = dataFromAPI.retailItems;
    });
  });
