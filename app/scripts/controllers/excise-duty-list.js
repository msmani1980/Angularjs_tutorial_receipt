'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExciseDutyListCtrl', function ($scope, exciseDutyFactory, lodash) {
    $scope.viewName = 'Excise Duty List';
    $scope.companyGlobalCurrency = 'GBP';
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    function formatSearchPayloadForAPI () {
      return {};
    }

    $scope.shouldShowSearchPrompt = function () {
      return $scope.exciseDutyList === null || !(angular.isDefined($scope.exciseDutyList));
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return (angular.isDefined($scope.exciseDutyList) && $scope.exciseDutyList !== null && $scope.exciseDutyList.length <= 0);
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.getExciseDutyList();
    };

    $scope.searchExciseData = function () {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.getExciseDutyList();
    };

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

      exciseDutyFactory.getExciseDutyList(payload).then(function (dataFromAPI) {
        $scope.exciseDutyList = angular.copy(dataFromAPI.response);
      });

      $this.meta.offset += $this.meta.limit;
    };

    function init () {
    }

    init();
  });
