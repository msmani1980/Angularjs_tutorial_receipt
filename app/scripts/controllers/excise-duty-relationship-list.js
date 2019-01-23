'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyRelationshipListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExciseDutyRelationshipListCtrl', function($scope, exciseDutyRelationshipFactory, dateUtility, lodash, $q, accessService) {
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
      $scope.displayEditError = false;
      $scope.errorResponse = dataFromAPI;
    }

    function showEditErrors(dataFromAPI) {
      hideLoadingModal();
      $scope.displayError = false;
      $scope.displayEditError = true;
      $scope.errorResponseEdit = dataFromAPI;
    }

    function hideErrors() {
      $scope.displayError = false;
      $scope.displayEditError = false;
      $scope.errorResponse = null;
      $scope.errorResponseEdit = null;
    }

    function isPanelOpen(panelName) {
      return !angular.element(panelName).hasClass('collapse');
    }

    function hidePanel(panelName) {
      if (!isPanelOpen(panelName)) {
        return;
      }

      if (panelName === '#create-collapse') {
        $scope.itemExciseDutyList = null;
        $scope.cancelEdit();
        $scope.inCreateMode = false;
      }

      angular.element(panelName).addClass('collapse');
    }

    function showPanel(panelName) {
      if (panelName === '#create-collapse') {
        $scope.inCreateMode = true;
      }

      angular.element(panelName).removeClass('collapse');
    }

    function togglePanel(panelName) {
      var otherPanelName = (panelName === '#search-collapse') ? '#create-collapse' : '#search-collapse';
      if (isPanelOpen(panelName)) {
        hidePanel(panelName);
        return;
      }

      showPanel(panelName);
      hidePanel(otherPanelName);
    }

    $scope.getUpdateBy = function (relationship) {
      if (relationship.updatedByPerson) {
        return relationship.updatedByPerson.userName;
      }

      if (relationship.createdByPerson) {
        return relationship.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (relationship) {
      return relationship.updatedOn ? dateUtility.formatTimestampForApp(relationship.updatedOn) : dateUtility.formatTimestampForApp(relationship.createdOn);
    };

    $scope.clearCreateForm = function(shouldClearAll) {
      hideErrors();
      var currentItemType = $scope.newRecord.itemType;
      $scope.displayError = false;
      $scope.displayEditError = false;
      $scope.newRecord = {
        itemType: (shouldClearAll) ? null : currentItemType,
        alcoholVolume: null
      };

      $scope.itemExciseDutyCreateForm.endDate.$setUntouched();
      $scope.itemExciseDutyCreateForm.startDate.$setUntouched();
    };

    $scope.clearSearchForm = function() {
      $scope.search = {};
      $scope.displayError = false;
      $scope.displayEditError = false;
      $scope.itemExciseDutyList = null;
      initLazyLoadingMeta();
    };

    $scope.toggleSearchPanel = function() {
      hideErrors();
      togglePanel('#search-collapse');
    };

    $scope.toggleCreatePanel = function() {
      hideErrors();
      $scope.clearCreateForm(true);
      $scope.clearSearchForm();
      $scope.cancelEdit();

      togglePanel('#create-collapse');
    };

    $scope.shouldShowSearchPrompt = function() {
      return !$scope.inCreateMode && (!$scope.itemExciseDutyList);
    };

    $scope.shouldShowCreatePrompt = function() {
      return $scope.inCreateMode && (!$scope.itemExciseDutyList || $scope.itemExciseDutyList.length <= 0);
    };

    $scope.shouldShowNoRecordsFoundPrompt = function() {
      return !$scope.inCreateMode && (angular.isDefined($scope.itemExciseDutyList) && $scope.itemExciseDutyList !==
        null && $scope.itemExciseDutyList.length <= 0);
    };

    $scope.shouldShowLoadingAlert = function() {
      return (angular.isDefined($scope.itemExciseDutyList) && $scope.itemExciseDutyList !== null && $this.meta.offset <
        $this.meta.count);
    };

    $scope.shouldRequireCreateFields = function() {
      return !$scope.inEditMode && $scope.inCreateMode;
    };

    $scope.searchItemExciseData = function() {
      hideErrors();
      initLazyLoadingMeta();
      $scope.itemExciseDutyList = null;
      showLoadingModal('Fetching Data');
      $scope.getItemExciseDutyList();
    };

    function reloadAfterAPISuccess() {
      hideLoadingModal();
      $scope.displayError = false;
      $scope.displayEditError = false;
      $scope.searchItemExciseData();
    }

    function localDeleteSuccess(recordId) {
      hideLoadingModal();
      var recordIndex = lodash.findIndex($scope.itemExciseDutyList, {
        id: recordId
      });
      if (angular.isDefined(recordIndex)) {
        $scope.itemExciseDutyList.splice(recordIndex, 1);
      }
    }

    function removeRecordSuccess(recordId) {
      if ($scope.inCreateMode) {
        localDeleteSuccess(recordId);
        return;
      }

      reloadAfterAPISuccess();
    }

    $scope.removeRecord = function(record) {
      showLoadingModal('Deleting Record');
      exciseDutyRelationshipFactory.deleteRelationship(record.id).then(function() {
        removeRecordSuccess(record.id);
      }, showErrors);
    };

    $scope.canDelete = function(exciseDuty) {
      return dateUtility.isAfterTodayDatePicker(exciseDuty.startDate);
    };

    function formatRecordForAPI(record) {
      var oldRecordMatch = lodash.findWhere($scope.itemExciseDutyList, {
        id: record.id
      });

      var payload = {
        startDate: dateUtility.formatDateForAPI(record.startDate),
        endDate: dateUtility.formatDateForAPI(record.endDate),
        itemMasterId: (!record.retailItem && $scope.inEditMode) ? oldRecordMatch.itemMasterId : record.retailItem.id,
        exciseDutyId: (!record.commodityCode && $scope.inEditMode) ? oldRecordMatch.exciseDutyId : record.commodityCode
          .id,
        alcoholVolume: parseFloat(record.alcoholVolume)
      };

      if (record.itemType) {
        payload.itemTypeId = record.itemType;
      }

      return payload;
    }

    function editInlineSuccess(responseFromAPI) {
      hideLoadingModal();
      var recordMatchIndex = lodash.findIndex($scope.itemExciseDutyList, {
        id: responseFromAPI.id
      });
      if (angular.isDefined(recordMatchIndex) && recordMatchIndex !== null) {
        exciseDutyRelationshipFactory.getRelationship(responseFromAPI.id).then(function (fetchResponse) {
          $scope.itemExciseDutyList[recordMatchIndex] = formatRecordForApp(angular.copy(fetchResponse));
        }, showErrors);
      }
    }

    function saveSuccess(responseFromAPI) {
      $scope.cancelEdit();
      if ($scope.inCreateMode) {
        editInlineSuccess(responseFromAPI);
        return;
      }

      reloadAfterAPISuccess();
    }

    function validateEditForm () {
      $scope.displayEditError = !$scope.itemExciseDutyEditForm.$valid;
      return $scope.itemExciseDutyEditForm.$valid;
    }

    $scope.saveEdit = function() {
      $this.clearErrors();
      if ($scope.displayEditError === true) {
        $this.clearCustomErrors();
      }

      $scope.displayError = false;
      var isDataValid =  $this.validateNewData($scope.recordToEdit);
      if (!isDataValid) {
        $scope.displayEditError = true;  
        return;
      }

      validateEditForm();
      showLoadingModal('Editing Record');
      var payload = formatRecordForAPI($scope.recordToEdit);
      exciseDutyRelationshipFactory.updateRelationship($scope.recordToEdit.id, payload).then(saveSuccess, showEditErrors);
    };

    $scope.cancelEdit = function() {
      $this.clearErrors();
      $scope.errorResponse = [];
      $scope.errorResponseEdit = [];
      $scope.inEditMode = false;
      $scope.recordToEdit = null;
    };

    $scope.canEdit = function(record) {
      return dateUtility.isTodayDatePicker(record.endDate) || dateUtility.isAfterTodayDatePicker(record.endDate);
    };

    $scope.isSelectedToEdit = function(record) {
      return ($scope.inEditMode && record.id === $scope.recordToEdit.id);
    };

    $scope.selectToEdit = function(record) {
      $scope.recordToEdit = angular.copy(record);
      var itemMatch = lodash.findWhere($scope.itemList, {
        id: record.itemMasterId
      });
      var exciseDutyMatch = lodash.findWhere($scope.exciseDutyList, {
        commodityCode: record.commodityCode
      });
      $scope.recordToEdit.retailItem = itemMatch;
      $scope.recordToEdit.commodityCode = exciseDutyMatch;
      $scope.recordToEdit.itemType = parseInt($scope.recordToEdit.itemTypeId);
      $scope.inEditMode = true;
    };

    function createSuccess(newRecordFromAPI) {
      hideLoadingModal();
      $scope.clearCreateForm(false);
      exciseDutyRelationshipFactory.getRelationship(newRecordFromAPI.id).then(getExciseDutyRelationshipByIdAfterCreateSaveSuccess, showErrors);
    }

    function getExciseDutyRelationshipByIdAfterCreateSaveSuccess(recordResponse) {
      var formattedRecordFromResponse = formatRecordForApp(recordResponse);
      $scope.itemExciseDutyList = $scope.itemExciseDutyList || [];
      $scope.itemExciseDutyList.push(formattedRecordFromResponse);
    }

    function validateCreateForm() {
      var isValid = !!$scope.newRecord.retailItem && !!$scope.newRecord.commodityCode;
      $scope.itemExciseDutyCreateForm.dutyFreeRetailItem.$setValidity('required', !!$scope.newRecord.retailItem);
      $scope.itemExciseDutyCreateForm.commodityCode.$setValidity('required', !!$scope.newRecord.commodityCode);
      $scope.itemExciseDutyCreateForm.alcoholVolume.$setValidity('required', !!$scope.itemExciseDutyCreateForm.alcoholVolume.$$rawModelValue);
      $scope.displayError = !isValid;
      if (isValid) {
        $scope.displayError = !$scope.itemExciseDutyCreateForm.$valid;
      }
    }

    $scope.createRelationship = function() {
      if ($scope.inEditMode) {
        $scope.errorCustom = [];
        var errPayload = {
          value: 'You are in edit mode. Please exit the edit mode and try again!'
        };

        $scope.errorCustom.push(errPayload);
        $scope.displayEditError = true;

        return;
      }

      $scope.inCreateMode = true;
      hideErrors();
      validateCreateForm();
      if ($scope.itemExciseDutyCreateForm.$valid) {
        showLoadingModal('Creating New Record');
        var payload = formatRecordForAPI($scope.newRecord);
        exciseDutyRelationshipFactory.createRelationship(payload).then(createSuccess, showErrors);
      }
    };

    function formatMultiSelectValuesForSearchPayload(searchKey, valueKey, payloadKey, workngPayload) {
      var newPayload = [];
      angular.forEach($scope.search[searchKey], function(record) {
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

    function formatRecordForApp(recordFrmAPI) {
      var newRecord = angular.copy(recordFrmAPI);
      newRecord.startDate = dateUtility.formatDateForApp(newRecord.startDate);
      newRecord.endDate = dateUtility.formatDateForApp(newRecord.endDate);
      var itemTypeMatch = lodash.findWhere($scope.itemTypes, {
        id: parseInt(newRecord.itemTypeId)
      });
      newRecord.itemTypeName = (angular.isDefined(itemTypeMatch)) ? itemTypeMatch.name : '';
      newRecord.alcoholVolume = parseFloat(newRecord.alcoholVolume).toFixed(2);
      return newRecord;
    }

    function formatResponseForApp(dataFromAPI) {
      hideLoadingModal();
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;

      var newItemExciseDutyList = [];
      angular.forEach(dataFromAPI.response, function(record) {
        var formattedRecord = formatRecordForApp(record);
        newItemExciseDutyList.push(formattedRecord);
      });

      $scope.itemExciseDutyList = ($scope.itemExciseDutyList) ? $scope.itemExciseDutyList.concat(
        newItemExciseDutyList) : newItemExciseDutyList;
    }

    $scope.getItemExciseDutyList = function() {
      if ($this.meta.offset >= $this.meta.count || $scope.inCreateMode) {
        return;
      }

      var payload = formatSearchPayloadForAPI();
      lodash.assign(payload, {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        sortOn: 'itemMaster.itemName,startDate',
        sortBy: 'ASC'
      });

      payload.limit = $this.meta.limit;
      payload.offset = $this.meta.offset;

      exciseDutyRelationshipFactory.getRelationshipList(payload).then(formatResponseForApp, showErrors);

      $this.meta.offset += $this.meta.limit;
    };

    function createRetailItemPayload(modelToCheck) {
      var retailItemPayload = {
        startDate: dateUtility.formatDateForAPI(modelToCheck.startDate) || '',
        endDate: dateUtility.formatDateForAPI(modelToCheck.endDate) || ''
      };
      if (modelToCheck.itemType) {
        retailItemPayload.itemTypeId = modelToCheck.itemType;
      }

      return retailItemPayload;
    }

    function createExciseDutyPayload(modelToCheck) {
      var exciseDutyPayload = {
        startDate: dateUtility.formatDateForAPI(modelToCheck.startDate) || '',
        endDate: dateUtility.formatDateForAPI(modelToCheck.endDate) || ''
      };

      return exciseDutyPayload;
    }

    function clearWatchGroupModels(modelToSet, shouldClearAll) {
      if (!modelToSet) {
        return;
      }

      if (!!modelToSet.itemType) {
        modelToSet.retailItem = null;
      }

      if (shouldClearAll) {
        modelToSet.retailItem = null;
        modelToSet.commodityCode = null;
      }
    }

    function findEditMatchAfterWatchSuccess() {
      if ($scope.inEditMode && $scope.recordToEdit.itemMasterId) {
        var itemMatch = lodash.findWhere($scope.itemListForEdit, {
          id: $scope.recordToEdit.itemMasterId
        });
        $scope.recordToEdit.retailItem = itemMatch || null;
      }

      if ($scope.inEditMode && $scope.recordToEdit.exciseDutyId) {
        var exciseDutyMatch = lodash.findWhere($scope.exciseDutyListForEdit, {
          id: $scope.recordToEdit.exciseDutyId
        });
        $scope.recordToEdit.commodityCode = exciseDutyMatch || null;
      }
    }

    function watchGroupSuccess(responseCollectionFromAPI, shouldSetEditModel) {
      if (shouldSetEditModel) {
        $scope.itemListForEdit = responseCollectionFromAPI[0].masterItems;
        $scope.exciseDutyListForEdit = (responseCollectionFromAPI[1]) ? responseCollectionFromAPI[1].response :
          $scope.exciseDutyListForEdit;
        findEditMatchAfterWatchSuccess();
        return;
      }

      $scope.itemListForCreate = responseCollectionFromAPI[0].masterItems;
      $scope.exciseDutyListForCreate = (responseCollectionFromAPI[1]) ? responseCollectionFromAPI[1].response :
        $scope.exciseDutyListForCreate;
    }

    function callWatchGroupAPI(shouldSetEditModel, shouldCallExciseDuty) {
      var modelToCheck = (shouldSetEditModel) ? $scope.recordToEdit : $scope.newRecord;
      var retailItemPayload = createRetailItemPayload(modelToCheck);
      var promises = [exciseDutyRelationshipFactory.getMasterItemList(retailItemPayload)];

      if (shouldCallExciseDuty) {
        var exciseDutyPayload = createExciseDutyPayload(modelToCheck);
        promises.push(exciseDutyRelationshipFactory.getExciseDutyList(exciseDutyPayload));
      }

      clearWatchGroupModels(modelToCheck, shouldCallExciseDuty);
      $q.all(promises).then(function(responseCollectionFromAPI) {
        watchGroupSuccess(responseCollectionFromAPI, shouldSetEditModel);
      }, showErrors);
    }

    function watchNewRecordDates() {
      $scope.$watchGroup(['newRecord.startDate', 'newRecord.endDate'], function() {
        if ($scope.inCreateMode && $scope.newRecord.startDate && $scope.newRecord.endDate) {
          callWatchGroupAPI(false, true);
          return;
        }

        clearWatchGroupModels($scope.newRecord, true);
        $scope.exciseDutyListForCreate = null;
        $scope.itemListForCreate = null;
      });
    }

    function watchNewRecordItemType() {
      $scope.$watch('newRecord.itemType', function() {
        if ($scope.inCreateMode && $scope.newRecord.startDate && $scope.newRecord.endDate) {
          callWatchGroupAPI(false, false);
        }
      });
    }

    function watchEditRecordDates() {
      $scope.$watchGroup(['recordToEdit.startDate', 'recordToEdit.endDate'], function() {
        if ($scope.inEditMode && $scope.recordToEdit.startDate && $scope.recordToEdit.endDate) {
          callWatchGroupAPI(true, true);
          return;
        }

        clearWatchGroupModels($scope.recordToEdit, true);
        $scope.exciseDutyListForEdit = null;
        $scope.itemListForEdit = null;
      });
    }

    function watchEditRecordItemType() {
      $scope.$watch('recordToEdit.itemType', function() {
        if ($scope.inEditMode && $scope.recordToEdit.startDate && $scope.recordToEdit.endDate) {
          callWatchGroupAPI(true, false);
        }
      });
    }

    function completeInit(responseArray) {
      $scope.exciseDutyList = angular.copy(responseArray[0].response);
      $scope.itemTypes = angular.copy(responseArray[1]);
      $scope.itemList = angular.copy(responseArray[2].masterItems);

      hideLoadingModal();
    }

    function callInitAPIs() {
      var promises = [
        exciseDutyRelationshipFactory.getExciseDutyList({}),
        exciseDutyRelationshipFactory.getItemTypes(),
        exciseDutyRelationshipFactory.getMasterItemList({})
      ];

      $q.all(promises).then(completeInit, showErrors);
    }

    function initVars() {
      initLazyLoadingMeta();
      $scope.newRecord = {};
      $scope.search = {};
      $scope.recordToEdit = {};
      $scope.inEditMode = false;
      $scope.inCreateMode = false;
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      $scope.errorCustom = [];
      $scope.displayError = false;
      $scope.displayEditError = false;

    }

    function initWatchGroups() {
      watchNewRecordDates();
      watchNewRecordItemType();
      watchEditRecordDates();
      watchEditRecordItemType();
    }

    function init() {
      showLoadingModal('initializing');
      $scope.isCRUD = accessService.crudAccessGranted('EXCISEDUTY', 'EXCISEDUTYRETAILITEM', 'CUDRIED');
      initVars();
      initWatchGroups();
      callInitAPIs();
    }

    init();

    $scope.isAlcoholVolumeValueInvalid = function (record) {
      var isInvalid = false; 
      if (record !== null && angular.isDefined(record.alcoholVolume)) {	
        isInvalid =  !record.alcoholVolume || (record.alcoholVolume && !record.alcoholVolume.match(/^\d{0,6}(\.\d{0,2})?$/));
      }

      return isInvalid;
    };    

    $scope.isAlcoholVolumeValid = function (record) {
      return $this.validateNewData(record);
    };

    $scope.isCurrentEffectiveDate = function (date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && dateUtility.isAfterTodayDatePicker(date.endDate));
    };

    this.showValidationError = function (field, isPattern) {
      var payload = { };

      if (isPattern) {
        payload = {
          field: field,
          value: 'field contains invalid characters'
        };
      } else {
        payload = {
          field: field,
          value: 'is a required field. Please update and try again!'
        };
      }

      $scope.errorCustom.push(payload);
      $scope.displayEditError = true;
    };

    $scope.isFieldEmpty = function (value) {
      return (value === undefined || value === null || value.length === 0 || value === 'Invalid date');
    };

    this.validateNewDataField = function (record, fieldName, fieldValidationName) {
      var result = true;

      if (record !== null && $scope.isFieldEmpty(record[fieldName])) {
        $this.showValidationError(fieldValidationName, false);
        result = false;
      }

      return result;
    };

    this.validateNewData = function (record) {
      var validateRi = $this.validateNewDataField(record, 'retailItem', 'Duty Free Retail Item');
      var validateCc = $this.validateNewDataField(record, 'commodityCode', 'Commodity Code');
      var validateAv = $this.validateNewDataField(record, 'alcoholVolume', 'Alcohol Volume');
      var validateAvChar = true;
      if (record !== null && !$scope.isFieldEmpty(record.alcoholVolume) && $scope.isAlcoholVolumeValueInvalid(record)) {
        $this.showValidationError('Alcohol Volume', true);
        validateAvChar = false;
      }

      var validateSd = $this.validateNewDataField(record, 'startDate', 'Start Date');
      var validateEd = $this.validateNewDataField(record, 'endDate', 'End Date');
      var isValidDr = true;
      if (record !== null && !$scope.isFieldEmpty(record.endDate) && !$scope.isFieldEmpty(record.startDate)) {
        isValidDr = $this.validateStartAndEndDates(record);
      }
      
      return validateRi && validateCc && validateAv && validateAvChar && validateSd && validateEd && isValidDr;
    };

    this.clearCustomErrors = function () {
      $scope.errorCustom = [];
      $scope.displayError = false;
      $scope.displayEditError = false;
    };

    this.clearErrors = function () {
      $this.clearCustomErrors();
      $scope.displayError = false;
      $scope.displayEditError = false;
      $scope.errorResponse = [];
      $scope.errorResponseEdit = [];
      $scope.errorCustom = [];
    };

    $scope.isDateValueInvalid = function (value, record) {
      var isInValid = $scope.isFieldEmpty(value) || (record.startDate && record.endDate && dateUtility.isAfterDatePicker(record.startDate, record.endDate));
      return isInValid;
    };

    $scope.isDateValueRangeInvalid = function (record) {
      var isInValid = dateUtility.isAfterDatePicker(record.startDate, record.endDate);
      return isInValid;
    };

    
    this.validateStartAndEndDates = function(record) {
      var isValid = true;
      if (!$scope.isFieldEmpty(record.startDate) && !$scope.isFieldEmpty(record.endDate) && $scope.isDateValueRangeInvalid(record)) {
        $scope.errorCustom.push({
          field: 'Start Date and End Date',
          value: ' End Date should be later than or equal to Start date.'
        });

        isValid = false;
      }
      return isValid; 
    };

  });
