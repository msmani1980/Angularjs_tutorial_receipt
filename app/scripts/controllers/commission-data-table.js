'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataTableCtrl
 * @description
 * # CommissionDataTableCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataTableCtrl', function ($scope, dateUtility, commissionFactory, $location, GlobalMenuService, employeesService, $q) {
    var companyId = GlobalMenuService.company.get();
    $scope.viewName = 'Commission Data Table';
    $scope.search = {};
    $scope.commissionData = [];
    $scope.crewBaseTypes = [];

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function setDataList(dataFromAPI) {
      $scope.commissionData = dataFromAPI.response;
      hideLoadingModal();
    }

    function getDataList(query) {
      showLoadingModal('fetching data');
      commissionFactory.getCommissionPayableList(query).then(setDataList);
    }

    function getDefaultDataList() {
      var payload = {
        'startDate': dateUtility.formatDateForAPI(dateUtility.nowFormatted())
      };
      getDataList(payload);
    }

    $scope.clearSearchForm = function () {
      $scope.search = {};
      getDefaultDataList();
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
      getDefaultDataList();
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
      return $scope.baseCurrency;
    };

    $scope.redirectToDetailPage = function (id, state) {
      $location.path('commission-data/' + state + '/' + id).search();
    };

    $scope.shouldShowCommissionPercent = function (record) {
      var recordTypeName = getNameForId(record.commissionPayableTypeId, $scope.commissionTypes);
      return (recordTypeName !== 'Retail item');
    };

    function getCrewBaseTypes() {
      var uniqueCrewBaseTypes = {};
      employeesService.getEmployees(companyId).then(function (dataFromAPI) {
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

    function getCurrencyData(currencyId) {
      commissionFactory.getCurrency(currencyId).then(function (response) {
        if (response) {
          $scope.baseCurrency = angular.copy(response.currencyCode);
        }
      });
    }

    function getCompanyData() {
      commissionFactory.getCompanyData(companyId).then(function (response) {
        if (response) {
          getCurrencyData(angular.copy(response.baseCurrencyId));
        }
      });
    }

    function init() {
      showLoadingModal('initializing data dependencies');
      var initPromises = [
        getCommissionPayableTypes(),
        getCrewBaseTypes(),
        getDiscountTypes(),
        getCompanyData()
      ];
      $q.all(initPromises).then(function () {
        getDefaultDataList();
      });
    }

    init();
  });
