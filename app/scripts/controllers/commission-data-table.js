'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataTableCtrl
 * @description
 * # CommissionDataTableCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataTableCtrl', function ($scope, dateUtility, commissionFactory, $location) {
    $scope.viewName       = 'Commission Data Table';
    $scope.search         = {};
    $scope.commissionData = [];

    function setDataList(dataFromAPI) {
      $scope.commissionData = dataFromAPI.response;
    }

    function getDataList(query) {
      commissionFactory.getCommissionPayableList(query).then(setDataList);
    }

    $scope.clearSearchForm = function () {
      $scope.search = {};
      getDataList({});
    };

    $scope.searchCommissionData = function () {
      var payload = {};
      if ($scope.search.crewBaseType) {
        payload.crewBaseTypeId = $scope.search.crewBaseType.id;
      }

      if ($scope.search.startDate) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
      }

      if ($scope.search.endDate) {
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }
      getDataList(payload);
    };

    $scope.canDelete = function (data) {
      return dateUtility.isAfterToday(data.startDate);
    };

    $scope.delete = function () {
      // TODO: call commissionFactory.deleteCommissionData();
    };

    function getNameForId(id, array) {
      var name = '';
      angular.forEach(array, function (item) {
        if (item.id === id) {
          name = item.name;
        }
      });
      return name;
    }

    $scope.getCrewBaseName = function (id) {
      return getNameForId(id, $scope.crewBaseTypes);
    };

    $scope.getCommissionTypeName = function (id) {
      return getNameForId(id, $scope.commissionTypes);
    };

    $scope.getUnitById = function (id) {
      var type = getNameForId(id, $scope.discountTypes);
      if (type === 'Percentage') {
        return '%';
      }
      return 'GBP'; // TODO: get base currency
    };

    $scope.redirectToDetailPage = function (id, state) {
      $location.path('commission-data/' + state + '/' + id).search();
    };

    function getCrewBaseTypes() {
      commissionFactory.getCrewBaseTypes().then(function (response) {
        $scope.crewBaseTypes = angular.copy(response);
      });
    }

    function getCommissionPayableTypes() {
      commissionFactory.getCommissionPayableTypes().then(function (response) {
        $scope.commissionTypes = angular.copy(response);
      });
    }

    function getDiscountTypes() {
      commissionFactory.getDiscountTypes().then(function (response) {
        $scope.discountTypes = angular.copy(response);
      });
    }

    function init() {
      getCrewBaseTypes();
      getCommissionPayableTypes();
      getDiscountTypes();
      getDataList({});
    }

    init();
  });
