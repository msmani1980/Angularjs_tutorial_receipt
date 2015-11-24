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

    function deleteCommissionDataSuccessHandler() {
      $scope.searchCommissionData();
    }

    $scope.removeRecord = function (data) {
      commissionFactory.deleteCommissionData(data.id).then(deleteCommissionDataSuccessHandler);
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
      return $scope.baseCurrency; // TODO: get base currency
    };

    $scope.redirectToDetailPage = function (id, state) {
      $location.path('commission-data/' + state + '/' + id).search();
    };

    $scope.shouldShowCommissionPercent = function (record) {
      var recordTypeName = getNameForId(record.commissionPayableTypeId, $scope.commissionTypes);
      return (recordTypeName !== 'Retail item');
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

    function completeInit() {
      getCrewBaseTypes();
      getCommissionPayableTypes();
      getDiscountTypes();
      var getDataPayload = {
        'startDate': dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };
      getDataList(getDataPayload);
    }

    function getCurrencyDataAndCompleteInit (currencyId) {
      commissionFactory.getCurrency(currencyId).then(function (response) {
        if(response) {
          $scope.baseCurrency = angular.copy(response.currencyCode);
        }
        completeInit();
      });
    }

    function getCompanyData() {
      commissionFactory.getCompanyData(companyId).then(function (response) {
        if(response) {
          getCurrencyDataAndCompleteInit(angular.copy(response.baseCurrencyId));
        }
      });
    }

    function init() {
      getCompanyData();
    }

    init();
  });
