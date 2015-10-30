'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataTableCtrl
 * @description
 * # CommissionDataTableCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataTableCtrl', function ($scope, dateUtility, commissionFactory, $location, GlobalMenuService, employeesService) {
    var companyId = GlobalMenuService.company.get();
    $scope.viewName       = 'Commission Data Table';
    $scope.search         = {};
    $scope.commissionData = [];
    $scope.crewBaseTypes  = [];

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

    $scope.removeRecord = function (data) {
      commissionFactory.deleteCommissionData(data.id);
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

    function getCrewBaseTypes () {
      var uniqueCrewBaseTypes = {};
      employeesService.getEmployees(companyId).then(function(dataFromAPI) {
        angular.forEach(dataFromAPI.companyEmployees, function (employee) {
          if (!(employee.baseStationId in uniqueCrewBaseTypes)) {
            uniqueCrewBaseTypes[employee.baseStationId] = {};
            $scope.crewBaseTypes.push({
              id: employee.baseStationId,
              name: employee.stationCode
            });
          }
        });
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
