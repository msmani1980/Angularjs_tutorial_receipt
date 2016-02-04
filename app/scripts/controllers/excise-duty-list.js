'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExciseDutyListCtrl', function ($scope, exciseDutyFactory) {
    $scope.viewName = 'Excise Duty List';
    $scope.companyGlobalCurrency = 'GBP';

    function getExciseDutyList() {
      exciseDutyFactory.getExciseDutyList().then(function (dataFromAPI) {
        $scope.exciseDutyList = angular.copy(dataFromAPI.response);
      });
    }

    function init () {
      getExciseDutyList();
    }

    init();
  });
