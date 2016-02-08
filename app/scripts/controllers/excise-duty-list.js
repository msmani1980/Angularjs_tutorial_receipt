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
      return $scope.exciseDutyList === null || !(angular.isDefined($scope.exciseDutyList));
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return (angular.isDefined($scope.exciseDutyList) && $scope.exciseDutyList !== null && $scope.exciseDutyList.length <= 0);
    };

    function hidePanel(panelName) {
      angular.element(panelName).addClass('collapse');
    }

    function showPanel(panelName) {
      angular.element(panelName).removeClass('collapse');
    }

    function togglePanel(panelName) {
      var otherPanelName = (panelName === '#search-collapse') ? '#create-collapse' : '#search-collapse';

      if (angular.element(panelName).hasClass('collapse')) {
        showPanel(panelName);
        hidePanel(otherPanelName);
      } else {
        hidePanel(panelName);
      }
    }

    $scope.toggleSearchPanel = function () {
      togglePanel('#search-collapse');
    };

    $scope.toggleCreatePanel = function () {
      togglePanel('#create-collapse');
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      if (!$scope.shouldShowSearchPrompt()) {
        $scope.getExciseDutyList();
      }
    };

    $scope.searchExciseData = function () {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.getExciseDutyList();
    };

    function formatSearchPayloadForAPI() {
      return {};
    }

    function formatExciseDutyResponseForApp(dataFromAPI) {
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
      showLoadingModal('initializing');
      var promises = [
        exciseDutyFactory.getCountriesList(),
        exciseDutyFactory.getVolumeUnits()
      ];
      $q.all(promises).then(completeInit);
    }

    init();
  });
