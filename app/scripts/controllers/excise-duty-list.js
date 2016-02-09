'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExciseDutyListCtrl', function ($scope, exciseDutyFactory, dateUtility, lodash, $q) {
    $scope.viewName = 'Excise Duty List';
    $scope.companyGlobalCurrency = 'GBP';
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    $scope.canEdit = function (exciseDuty) {
      return dateUtility.isTodayOrEarlier(exciseDuty.startDate) && dateUtility.isAfterToday(exciseDuty.endDate);
    };

    $scope.canDelete = function (exciseDuty) {
      return dateUtility.isAfterToday(exciseDuty.startDate);
    };

    $scope.shouldShowSearchPrompt = function () {
      return !isPanelOpen('#create-collapse') && ($scope.exciseDutyList === null || !(angular.isDefined($scope.exciseDutyList)));
    };

    $scope.shouldShowCreatePrompt = function () {
      return isPanelOpen('#create-collapse') && ($scope.exciseDutyList === null || !(angular.isDefined($scope.exciseDutyList)));
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return !isPanelOpen('#create-collapse') && (angular.isDefined($scope.exciseDutyList) && $scope.exciseDutyList !== null && $scope.exciseDutyList.length <= 0);
    };

    $scope.clearSearchForm = function () {
      $scope.search = null;
      $scope.exciseDutyList = null;
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    };

    $scope.clearCreateForm = function (shouldClearAll) {
      var currentCountry = $scope.newRecord.country;
      $scope.newRecord = {
        alcoholic: false,
        country: (shouldClearAll) ? null : currentCountry
      };
    };

    $scope.searchExciseData = function () {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.getExciseDutyList();
    };

    function isPanelOpen(panelName) {
      return !angular.element(panelName).hasClass('collapse');
    }

    function hidePanel(panelName) {
      angular.element(panelName).addClass('collapse');
    }

    function showPanel(panelName) {
      angular.element(panelName).removeClass('collapse');
    }

    function togglePanel(panelName) {
      var otherPanelName = (panelName === '#search-collapse') ? '#create-collapse' : '#search-collapse';
      if (isPanelOpen(panelName)) {
        hidePanel(panelName);
      } else {
        showPanel(panelName);
        hidePanel(otherPanelName);
      }
    }

    $scope.toggleSearchPanel = function () {
      togglePanel('#search-collapse');
    };

    $scope.toggleCreatePanel = function () {
      $scope.clearSearchForm();
      $scope.clearCreateForm(true);
      togglePanel('#create-collapse');
    };

    function createSuccess() {
      if ($scope.search && $scope.search.commodityCode) {
        $scope.search = { commodityCode: $scope.search.commodityCode + ',' + $scope.newRecord.commodityCode };
      } else {
        $scope.search = { commodityCode: $scope.newRecord.commodityCode };
      }

      $scope.clearCreateForm(false);
      $scope.searchExciseData();
    }

    function formatNewRecordForAPI() {
      var newRecord = {
        commodityCode: $scope.newRecord.commodityCode,
        dutyRate: parseFloat($scope.newRecord.dutyRate),
        startDate: dateUtility.formatDateForAPI($scope.newRecord.startDate),
        endDate: dateUtility.formatDateForAPI($scope.newRecord.endDate),
        volumeUnitId: $scope.newRecord.volume,
        countryId: $scope.newRecord.country.id,
        alcoholic: $scope.newRecord.alcoholic
      };
      return newRecord;
    }

    $scope.createExciseDuty = function () {
      var payload = formatNewRecordForAPI();
      exciseDutyFactory.createExciseDuty(payload).then(createSuccess);
    };

    function formatSearchPayloadForAPI() {
      var payload = {};
      if ($scope.search && $scope.search.commodityCode) {
        payload.commodityCode = $scope.search.commodityCode;
      }

      if ($scope.search && $scope.search.startDate) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
      }

      if ($scope.search && $scope.search.endDate) {
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }

      return payload;
    }

    function formatExciseDutyResponseForApp(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;

      var newExciseDutyList = angular.copy(dataFromAPI.response);
      angular.forEach(newExciseDutyList, function (exciseDuty) {
        exciseDuty.startDate = dateUtility.formatDateForApp(exciseDuty.startDate);
        exciseDuty.endDate = dateUtility.formatDateForApp(exciseDuty.endDate);
        var countryMatch = lodash.findWhere($scope.countryList, { id: exciseDuty.countryId });
        var volumeMatch = lodash.findWhere($scope.volumeUnits, { id: exciseDuty.volumeUnitId });
        exciseDuty.countryName = (angular.isDefined(countryMatch)) ? countryMatch.countryName : '';
        exciseDuty.volumeUnit = (angular.isDefined(volumeMatch)) ? volumeMatch.unitName : '';
      });

      $scope.exciseDutyList = newExciseDutyList;
    }

    $scope.getExciseDutyList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = formatSearchPayloadForAPI();
      lodash.assign(payload, {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      //sortOn: 'countryId,commodityCode,startDate',
      //sortBy: 'ASC'

      payload.limit = $this.meta.limit;
      payload.offset = $this.meta.offset;

      exciseDutyFactory.getExciseDutyList(payload).then(formatExciseDutyResponseForApp);

      $this.meta.offset += $this.meta.limit;
    };

    function completeInit(responseArray) {
      $scope.countryList = responseArray[0].countries;
      $scope.volumeUnits = responseArray[1].units;
      hideLoadingModal();
    }

    function init() {
      $scope.newRecord = {
        alcoholic: false
      };
      $scope.search = {};
      showLoadingModal('initializing');
      var promises = [
        exciseDutyFactory.getCountriesList(),
        exciseDutyFactory.getVolumeUnits()
      ];
      $q.all(promises).then(completeInit);
    }

    init();
  });
