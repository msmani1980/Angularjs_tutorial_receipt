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

    $scope.clearCreateForm = function (shouldClearAll) {
      var currentItemType = $scope.newRecord.itemType;
      $scope.displayError = false;
      $scope.newRecord = {
        itemType: (shouldClearAll) ? null : currentItemType
      };

      $scope.itemExciseDutyCreateForm.endDate.$setUntouched();
      $scope.itemExciseDutyCreateForm.startDate.$setUntouched();
    };

    $scope.clearSearchForm = function () {
      $scope.search = null;
      $scope.itemExciseDutyList = null;
      initLazyLoadingMeta();
    };

    $scope.toggleSearchPanel = function () {
      togglePanel('#search-collapse');
    };

    $scope.toggleCreatePanel = function () {
      $scope.clearCreateForm(true);
      $scope.clearSearchForm();
      togglePanel('#create-collapse');
    };

    $scope.shouldShowSearchPrompt = function () {
      return !isPanelOpen('#create-collapse') && (!$scope.itemExciseDutyList);
    };

    $scope.shouldShowCreatePrompt = function () {
      return isPanelOpen('#create-collapse') && (!$scope.itemExciseDutyList || $scope.itemExciseDutyList.length <= 0);
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return !isPanelOpen('#create-collapse') && (angular.isDefined($scope.itemExciseDutyList) && $scope.itemExciseDutyList !== null && $scope.itemExciseDutyList.length <= 0);
    };

    $scope.shouldShowLoadingAlert = function () {
      return (angular.isDefined($scope.itemExciseDutyList) && $scope.itemExciseDutyList !== null && $this.meta.offset < $this.meta.count);
    };

    $scope.shouldRequireCreateFields = function () {
      return !$scope.inEditMode && isPanelOpen('#create-collapse');
    };

    $scope.searchItemExciseData = function () {
      initLazyLoadingMeta();
      $scope.itemExciseDutyList = null;
      $scope.getItemExciseDutyList();
    };

    function reloadAfterAPISuccess() {
      hideLoadingModal();
      $scope.searchExciseData();
    }

    $scope.removeRecord = function (record) {
      showLoadingModal('Deleting Record');
      exciseDutyRelationshipFactory.deleteRelationship(record.id).then(reloadAfterAPISuccess, showErrors);
    };

    $scope.canDelete = function (exciseDuty) {
      return dateUtility.isAfterToday(exciseDuty.startDate);
    };

    function formatRecordForAPI(record) {
      //var oldRecordMatch = lodash.findWhere($scope.exciseDutyList, { id: record.id });
      //if ($scope.inEditMode && !record.startDate) {
      //  record.startDate = oldRecordMatch.startDate;
      //}
      //
      //if ($scope.inEditMode && !record.endDate) {
      //  record.endDate = oldRecordMatch.endDate;
      //}

      var payload = {
        startDate: dateUtility.formatDateForAPI(record.startDate),
        endDate: dateUtility.formatDateForAPI(record.endDate),
        itemMasterId: record.retailItem.id,
        exciseDutyId: record.commodityCode.id,
        alcoholVolume: parseFloat(record.alcoholVolume)
      };

      if (record.itemType) {
        payload.itemTypeId = record.itemType;
      }

      return payload;
    }

    //$scope.saveEdit = function () {
    //  showLoadingModal('Editing Record');
    //  var payload = formatRecordForAPI($scope.recordToEdit);
    //  exciseDutyFactory.updateExciseDuty($scope.recordToEdit.id, payload).then(function () {
    //    $scope.cancelEdit();
    //    reloadAfterAPISuccess();
    //  }, showErrors);
    //};

    $scope.cancelEdit = function () {
      $scope.inEditMode = false;
      $scope.recordToEdit = null;
    };

    $scope.canEdit = function (record) {
      return dateUtility.isAfterToday(record.endDate);
    };

    $scope.isSelectedToEdit = function (record) {
      return ($scope.inEditMode && record.id === $scope.recordToEdit.id);
    };

    $scope.selectToEdit = function (record) {
      $scope.recordToEdit = angular.copy(record);
      var itemMatch = lodash.findWhere($scope.itemList, { id: record.itemMasterId });
      var exciseDutyMatch = lodash.findWhere($scope.exciseDutyList, { id: record.exciseDutyId });
      $scope.recordToEdit.retailItem = itemMatch;
      $scope.recordToEdit.commodityCode = exciseDutyMatch;
      $scope.inEditMode = true;
    };

    function createSuccess(newRecordFromAPI) {
      hideLoadingModal();
      $scope.clearCreateForm(false);
      console.log(newRecordFromAPI);

      // TODO: add new record to itemExciseDutyList array

      //$scope.searchExciseData();
    }

    function validateCreateForm() {
      var isValid = !!$scope.newRecord.retailItem && !!$scope.newRecord.commodityCode;
      $scope.itemExciseDutyCreateForm.retailItem.$setValidity('required', !!$scope.newRecord.retailItem);
      $scope.itemExciseDutyCreateForm.commodityCode.$setValidity('required', !!$scope.newRecord.commodityCode);
      $scope.displayError = !isValid;
    }

    $scope.createRelationship = function () {
      validateCreateForm();
      if ($scope.itemExciseDutyCreateForm.$valid) {
        showLoadingModal('Creating New Record');
        var payload = formatRecordForAPI($scope.newRecord);
        exciseDutyRelationshipFactory.createRelationship(payload).then(createSuccess, showErrors);
      }
    };

    function formatMultiSelectValuesForSearchPayload(searchKey, valueKey, payloadKey, workngPayload) {
      var newPayload = [];
      angular.forEach($scope.search[searchKey], function (record) {
        newPayload.push(record[valueKey]);
      });

      if (newPayload.length) {
        workngPayload[payloadKey] = newPayload.toString();
      }
    }

    function formatSearchPayloadForAPI() {
      if (!$scope.search) {
        return {};
      }

      var payload = {};
      if ($scope.search.startDate) {
        payload.startDate = dateUtility.formatDateForAPI($scope.search.startDate);
      }

      if ($scope.search.endDate) {
        payload.endDate = dateUtility.formatDateForAPI($scope.search.endDate);
      }

      if ($scope.search.itemType) {
        payload.itemTypeId = $scope.search.itemType;
      }

      formatMultiSelectValuesForSearchPayload('commodityCodes', 'commodityCode', 'commodityCode', payload);
      formatMultiSelectValuesForSearchPayload('retailItems', 'id', 'itemMasterId', payload);

      return payload;
    }

    function formatResponseForApp(dataFromAPI) {
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;

      var newItemExciseDutyList = angular.copy(dataFromAPI.response);
      angular.forEach(newItemExciseDutyList, function (record) {
        record.startDate = dateUtility.formatDateForApp(record.startDate);
        record.endDate = dateUtility.formatDateForApp(record.endDate);
        var itemTypeMatch = lodash.findWhere($scope.itemTypes, { id: parseInt(record.itemTypeId) });
        record.itemTypeName = (angular.isDefined(itemTypeMatch)) ? itemTypeMatch.name : '';
        record.dutyRate = parseFloat(record.alcoholVolume).toFixed(2);
      });

      $scope.itemExciseDutyList = ($scope.itemExciseDutyList) ? $scope.itemExciseDutyList.concat(newItemExciseDutyList) : newItemExciseDutyList;
    }

    $scope.getItemExciseDutyList = function () {
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
      var today = dateUtility.formatDateForAPI(dateUtility.nowFormatted());
      var promises = [
        exciseDutyRelationshipFactory.getExciseDutyList({ startDate: today }),
        exciseDutyRelationshipFactory.getItemTypes(),
        exciseDutyRelationshipFactory.getMasterItemList({ startDate: today })
      ];

      $q.all(promises).then(completeInit, showErrors);
    }

    function initVars() {
      initLazyLoadingMeta();
      $scope.newRecord = {};
      $scope.search = {};
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
