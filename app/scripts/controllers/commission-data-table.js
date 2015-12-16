'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CommissionDataTableCtrl
 * @description
 * # CommissionDataTableCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CommissionDataTableCtrl', function ($scope, dateUtility, commissionFactory, $location, GlobalMenuService, employeesService, $q, lodash) {
    var companyId = GlobalMenuService.company.get();
    $scope.viewName = 'Commission Data Table';
    $scope.search = {};
    $scope.commissionData = [];
    $scope.crewBaseTypes = [];

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function setDataList(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;
      $scope.commissionData = $scope.commissionData.concat(dataFromAPI.response);
      hideLoadingBar();
    }

    var initDone = false;
    function getDataList(query) {
      if (!initDone) {
        return;
      }
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      query = lodash.assign(query, {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
      showLoadingBar();

      commissionFactory.getCommissionPayableList(query).then(setDataList);
      $this.meta.offset += $this.meta.limit;
    }

    function searchCommissionData() {
      var payload = {};
      if ($scope.search.crewBaseType) {
        payload.crewBaseTypeId = $scope.search.crewBaseType.id;
      }

      if ($scope.search.startDate) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
      } else {
        payload.startDate = dateUtility.formatDateForAPI(dateUtility.nowFormatted());

      }

      if ($scope.search.endDate) {
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }
      getDataList(payload);
    }

    $scope.getCommissionData = function () {
      searchCommissionData();
    };

    $scope.searchCommissionData = function () {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.commissionData = [];
      searchCommissionData();
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.searchCommissionData();
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
        hideLoadingModal();
        initDone = true;
        $scope.searchCommissionData();
      });
    }

    init();
  });
