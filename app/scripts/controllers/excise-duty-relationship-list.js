'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyRelationshipListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExciseDutyRelationshipListCtrl', function ($scope, exciseDutyRelationshipFactory, dateUtility, lodash, $q) {
    $scope.viewName = 'Retail Item - Excise Duty Relationships';
    var $this = this;

    function initLazyLoadingMeta() {
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    }

    function showLoadingModal(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    }

    function hideLoadingModal() {
      angular.element('#loading').modal('hide');
    }

    function showErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    }
    
    //
    //function isPanelOpen(panelName) {
    //  return !angular.element(panelName).hasClass('collapse');
    //}
    //
    //function hidePanel(panelName) {
    //  if (panelName === '#create-collapse') {
    //    $scope.clearSearchForm();
    //  }
    //
    //  angular.element(panelName).addClass('collapse');
    //}
    //
    //function showPanel(panelName) {
    //  if (panelName === '#create-collapse') {
    //    $scope.clearSearchForm();
    //  }
    //
    //  angular.element(panelName).removeClass('collapse');
    //}
    //
    //function togglePanel(panelName) {
    //  var otherPanelName = (panelName === '#search-collapse') ? '#create-collapse' : '#search-collapse';
    //  if (isPanelOpen(panelName)) {
    //    hidePanel(panelName);
    //  } else {
    //    showPanel(panelName);
    //    hidePanel(otherPanelName);
    //  }
    //}
    //
    //$scope.clearCreateForm = function (shouldClearAll) {
    //  var currentCountry = $scope.newRecord.country;
    //  $scope.displayError = false;
    //  $scope.newRecord = {
    //    alcoholic: false,
    //    country: (shouldClearAll) ? null : currentCountry
    //  };
    //
    //  $scope.itemExciseDutyCreateForm.endDate.$setUntouched();
    //  $scope.itemExciseDutyCreateForm.startDate.$setUntouched();
    //};
    //
    //$scope.clearSearchForm = function () {
    //  $scope.search = null;
    //  $scope.exciseDutyList = null;
    //  initLazyLoadingMeta();
    //};
    //
    //$scope.toggleSearchPanel = function () {
    //  togglePanel('#search-collapse');
    //};
    //
    //$scope.toggleCreatePanel = function () {
    //  $scope.clearCreateForm(true);
    //  togglePanel('#create-collapse');
    //};
    //
    //$scope.shouldShowSearchPrompt = function () {
    //  return !isPanelOpen('#create-collapse') && (!$scope.itemExciseDutyList);
    //};
    //
    //$scope.shouldShowCreatePrompt = function () {
    //  return isPanelOpen('#create-collapse') && (!$scope.itemExciseDutyList || $scope.itemExciseDutyList.length <= 0);
    //};
    //
    //$scope.shouldShowNoRecordsFoundPrompt = function () {
    //  return !isPanelOpen('#create-collapse') && (angular.isDefined($scope.itemExciseDutyList) && $scope.itemExciseDutyList !== null && $scope.itemExciseDutyList.length <= 0);
    //};
    //
    //$scope.shouldShowLoadingAlert = function () {
    //  return (angular.isDefined($scope.itemExciseDutyList) && $scope.itemExciseDutyList !== null && $this.meta.offset < $this.meta.count);
    //};
    //
    //$scope.shouldRequireCreateFields = function () {
    //  return !$scope.inEditMode && isPanelOpen('#create-collapse');
    //};
    //
    $scope.searchItemExciseData = function () {
      initLazyLoadingMeta();
      $scope.itemExciseDutyList = null;
      $scope.getItemExciseDutyList();
    };

    //function reloadAfterAPISuccess() {
    //  hideLoadingModal();
    //  $scope.searchExciseData();
    //}
    //
    //$scope.removeRecord = function (record) {
    //  showLoadingModal('Deleting Record');
    //  exciseDutyFactory.deleteExciseDuty(record.id).then(reloadAfterAPISuccess, showErrors);
    //};
    //
    //$scope.canDelete = function (exciseDuty) {
    //  return dateUtility.isAfterToday(exciseDuty.startDate);
    //};
    //
    //function formatRecordForAPI(record) {
    //  var oldRecordMatch = lodash.findWhere($scope.exciseDutyList, { id: record.id });
    //  if ($scope.inEditMode && !record.startDate) {
    //    record.startDate = oldRecordMatch.startDate;
    //  }
    //
    //  if ($scope.inEditMode && !record.endDate) {
    //    record.endDate = oldRecordMatch.endDate;
    //  }
    //
    //  var payload = {
    //    commodityCode: record.commodityCode,
    //    dutyRate: parseFloat(record.dutyRate),
    //    startDate: dateUtility.formatDateForAPI(record.startDate),
    //    endDate: dateUtility.formatDateForAPI(record.endDate),
    //    volumeUnitId: record.volumeUnitId,
    //    countryId: record.country.id,
    //    alcoholic: record.alcoholic
    //  };
    //
    //  return payload;
    //}
    //
    //$scope.saveEdit = function () {
    //  showLoadingModal('Editing Record');
    //  var payload = formatRecordForAPI($scope.recordToEdit);
    //  exciseDutyFactory.updateExciseDuty($scope.recordToEdit.id, payload).then(function () {
    //    $scope.cancelEdit();
    //    reloadAfterAPISuccess();
    //  }, showErrors);
    //};
    //
    //$scope.cancelEdit = function () {
    //  $scope.inEditMode = false;
    //  $scope.recordToEdit = null;
    //};
    //
    //$scope.canEdit = function (exciseDuty) {
    //  return dateUtility.isAfterToday(exciseDuty.endDate);
    //};
    //
    //$scope.isSelectedToEdit = function (exciseDuty) {
    //  return ($scope.inEditMode && exciseDuty.id === $scope.recordToEdit.id);
    //};
    //
    //$scope.selectToEdit = function (exciseDuty) {
    //  $scope.recordToEdit = angular.copy(exciseDuty);
    //  var countryMatch = lodash.findWhere($scope.countryList, { id: exciseDuty.countryId });
    //  $scope.recordToEdit.country = countryMatch;
    //  $scope.inEditMode = true;
    //};
    //
    //function createSuccess() {
    //  if ($scope.search && $scope.search.commodityCode) {
    //    $scope.search = { commodityCode: $scope.search.commodityCode + ',' + $scope.newRecord.commodityCode };
    //  } else {
    //    $scope.search = { commodityCode: $scope.newRecord.commodityCode };
    //  }
    //
    //  $scope.clearCreateForm(false);
    //  $scope.searchExciseData();
    //}
    //
    //function validateCreateForm() {
    //  var isValid = !!$scope.newRecord.country;
    //  $scope.exciseDutyCreateForm.country.$setValidity('required', isValid);
    //  $scope.displayError = !isValid;
    //}
    //
    //$scope.createExciseDuty = function () {
    //  validateCreateForm();
    //  if ($scope.exciseDutyCreateForm.$valid) {
    //    var payload = formatRecordForAPI($scope.newRecord);
    //    exciseDutyFactory.createExciseDuty(payload).then(createSuccess, showErrors);
    //  }
    //};
    //
    //function formatSearchPayloadForAPI() {
    //  var payload = {};
    //  if ($scope.search && $scope.search.commodityCode) {
    //    payload.commodityCode = $scope.search.commodityCode;
    //  }
    //
    //  if ($scope.search && $scope.search.startDate) {
    //    payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
    //  }
    //
    //  if ($scope.search && $scope.search.endDate) {
    //    payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
    //  }
    //
    //  return payload;
    //}
    //
    function formatResponseForApp(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;

      var newItemExciseDutyList = angular.copy(dataFromAPI.response);
      angular.forEach(newItemExciseDutyList, function (exciseDuty) {
        exciseDuty.startDate = dateUtility.formatDateForApp(exciseDuty.startDate);
        exciseDuty.endDate = dateUtility.formatDateForApp(exciseDuty.endDate);

        //var countryMatch = lodash.findWhere($scope.countryList, { id: exciseDuty.countryId });
        //var volumeMatch = lodash.findWhere($scope.volumeUnits, { id: exciseDuty.volumeUnitId });
        //exciseDuty.countryName = (angular.isDefined(countryMatch)) ? countryMatch.countryName : '';
        //exciseDuty.volumeUnit = (angular.isDefined(volumeMatch)) ? volumeMatch.unitName : '';
        //exciseDuty.dutyRate = parseFloat(exciseDuty.dutyRate).toFixed(2);
      });

      $scope.itemExciseDutyList = ($scope.itemExciseDutyList) ? $scope.itemExciseDutyList.concat(newItemExciseDutyList) : newItemExciseDutyList;
    }

    $scope.getItemExciseDutyList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      //var payload = formatSearchPayloadForAPI();
      var payload = {};
      lodash.assign(payload, {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      //sortOn: 'countryId,commodityCode,startDate',
      //sortBy: 'ASC'

      payload.limit = $this.meta.limit;
      payload.offset = $this.meta.offset;

      exciseDutyRelationshipFactory.getRelationshipList(payload).then(formatResponseForApp, showErrors);

      $this.meta.offset += $this.meta.limit;
    };

    function completeInit(responseArray) {
      $scope.exciseDutyList = angular.copy(responseArray[0].response);
      $scope.itemTypes = angular.copy(responseArray[1]);
      $scope.itemList = angular.copy(responseArray[2].masterItems);

      hideLoadingModal();
    }

    function callInitAPIs() {
      var promises = [
        exciseDutyRelationshipFactory.getExciseDutyList(),
        exciseDutyRelationshipFactory.getItemTypes(),
        exciseDutyRelationshipFactory.getMasterItemList({})
      ];

      $q.all(promises).then(completeInit, showErrors);
    }

    function initVars () {
      initLazyLoadingMeta();
      $scope.newRecord = {};
      $scope.search = null;
      $scope.recordToEdit = null;
      $scope.inEditMode = false;
      $scope.minDate = dateUtility.tomorrowFormatted();
    }

    function init() {
      showLoadingModal('initializing');
      initVars();
      callInitAPIs();
    }

    init();
  });
