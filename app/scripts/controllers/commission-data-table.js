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

    $scope.getCrewBaseName = function (id) {
      return $this.getNameForId(id, $scope.crewBaseTypes);
    };

    $scope.getCommissionTypeName = function (id) {
      return $this.getNameForId(id, $scope.commissionTypes);
    };

    $scope.getUnitById = function(id) {
      var type = $this.getNameForId(id, $scope.discountTypes);
      if(type === 'Percentage') {
        return '%';
      }
      return 'GBP'; // TODO: get base currency
    };

    this.getDataList = function (query) {
      commissionFactory.getCommissionPayableList(query).then(function (response) {
        $scope.commissionData = response.response;
      })
    };

    this.getCrewBaseTypes = function () {
      commissionFactory.getCrewBaseTypes().then(function (response) {
        $scope.crewBaseTypes = response;
      });
    };

    this.getCommissionPayableTypes = function () {
      commissionFactory.getCommissionPayableTypes().then(function (response) {
        $scope.commissionTypes = response;
      });
    };

    this.getDiscountTypes = function () {
      commissionFactory.getDiscountTypes().then(function (response) {
        $scope.discountTypes = response;
      });
    };

    this.getNameForId = function (id, array) {
      var name = '';
      angular.forEach(array, function (item) {
        if(item.id === id) {
          name = item.name;
        }
      });
      return name;
    };

    this.init = function () {
      $this.getCrewBaseTypes();
      $this.getCommissionPayableTypes();
      $this.getDiscountTypes();
      $this.getDataList({});
    };

    this.init();
  });
