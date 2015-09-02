'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataTableCtrl
 * @description
 * # CommissionDataTableCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataTableCtrl', function ($scope, dateUtility, commissionFactory) {
    var $this = this;
    $scope.viewName = 'Commission Data Table';
    $scope.search = {};
    $scope.commissionData = [];

    $scope.searchCommissionData = function () {
      $this.getDataList($scope.search);
    };

    $scope.clearSearch = function () {
      $scope.search = {};
      $this.getDataList({});
    };

    $scope.canDelete = function (data) {
      return dateUtility.isAfterToday(data.startDate);
    };

    $scope.delete = function () {
      // TODO: call commissionFactory.deleteCommissionData();
    };

    this.getDataList = function (query) {
      //commissionFactory.getCommissionPayableList().then(function (response) {
      //  $scope.commissionData = response.response;
      //})
    };

    $this.getDataList({});

  });
