'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeCommissionListCtrl
 * @description
 * # EmployeeCommissionListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('EmployeeCommissionListCtrl', function ($scope) {
    $scope.viewName = 'Employee Commission';
    $scope.search = {
      startDate: moment().add(1, 'days').format('L').toString(),
      itemList: [],
      priceTypesList: [],
      taxRateTypesList: []
    }

  });
