'use strict';
/*jshint maxcomplexity:6*/
/**
 * @ngdoc function
 * @name ts5App.controller:ExciseDutyListCtrl
 * @description
 * # ExciseDutyListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('ExciseDutyListCtrl', function ($scope, exciseDutyFactory, globalMenuService, dateUtility, lodash, $q, accessService) {
    $scope.viewName = 'Excise Duty List';
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

    function hideErrors() {
      $scope.displayError = false;
      $scope.errorResponse = null;
    }

    function isPanelOpen(panelName) {
      return !angular.element(panelName).hasClass('collapse');
    }

    function hidePanel(panelName) {
      if (!isPanelOpen(panelName)) {
        return;
      }

      if (panelName === '#create-collapse') {
        $scope.cancelEdit();
        $scope.clearSearchForm();
      }

      angular.element(panelName).addClass('collapse');
    }

    function showPanel(panelName) {
      if (panelName === '#create-collapse') {
        $scope.clearSearchForm();
      }

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

    $scope.getUpdateBy = function (exciseDuty) {
      if (exciseDuty.updatedByPerson) {
        return exciseDuty.updatedByPerson.userName;
      }

      if (exciseDuty.createdByPerson) {
        return exciseDuty.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (exciseDuty) {
      return exciseDuty.updatedOn ? dateUtility.formatTimestampForApp(exciseDuty.updatedOn) : dateUtility.formatTimestampForApp(exciseDuty.createdOn);
    };

    $scope.clearCreateForm = function (shouldClearAll) {
      var currentCountry = $scope.newRecord.country;
      $scope.displayError = false;
      $scope.newRecord = {
        alcoholic: false,
        country: (shouldClearAll) ? null : currentCountry
      };

      $scope.exciseDutyCreateForm.endDate.$setUntouched();
      $scope.exciseDutyCreateForm.startDate.$setUntouched();
    };

    $scope.clearSearchForm = function () {
      hideErrors();
      $scope.search = null;
      $scope.exciseDutyList = null;
      initLazyLoadingMeta();
    };

    $scope.toggleSearchPanel = function () {
      togglePanel('#search-collapse');
    };

    $scope.toggleCreatePanel = function () {
      $scope.clearCreateForm(true);
      $scope.cancelEdit();
      togglePanel('#create-collapse');
    };

    $scope.shouldShowSearchPrompt = function () {
      return !isPanelOpen('#create-collapse') && (!$scope.exciseDutyList);
    };

    $scope.shouldShowCreatePrompt = function () {
      return isPanelOpen('#create-collapse') && (!$scope.exciseDutyList || $scope.exciseDutyList.length <= 0);
    };

    $scope.shouldShowNoRecordsFoundPrompt = function () {
      return !isPanelOpen('#create-collapse') && (angular.isDefined($scope.exciseDutyList) && $scope.exciseDutyList !== null && $scope.exciseDutyList.length <= 0);
    };

    $scope.shouldShowLoadingAlert = function () {
      return (angular.isDefined($scope.exciseDutyList) && $scope.exciseDutyList !== null && $this.meta.offset < $this.meta.count);
    };

    $scope.shouldRequireCreateFields = function () {
      return !$scope.inEditMode && isPanelOpen('#create-collapse');
    };

    $scope.searchExciseData = function () {
      hideErrors();
      initLazyLoadingMeta();
      $scope.exciseDutyList = null;
      showLoadingModal('fetching records');
      $scope.getExciseDutyList();
    };

    function reloadAfterAPISuccess() {
      hideLoadingModal();
      $scope.searchExciseData();
    }

    $scope.removeRecord = function (record) {
      showLoadingModal('Deleting Record');
      exciseDutyFactory.deleteExciseDuty(record.id).then(reloadAfterAPISuccess, showErrors);
    };

    $scope.canDelete = function (exciseDuty) {
      return dateUtility.isAfterTodayDatePicker(exciseDuty.startDate);
    };

    function formatRecordForAPI(record) {
      var oldRecordMatch = lodash.findWhere($scope.exciseDutyList, { id: record.id });
      if ($scope.inEditMode && !record.startDate) {
        record.startDate = oldRecordMatch.startDate;
      }

      if ($scope.inEditMode && !record.endDate) {
        record.endDate = oldRecordMatch.endDate;
      }

      var payload = {
        commodityCode: record.commodityCode,
        dutyRate: parseFloat(record.dutyRate),
        startDate: dateUtility.formatDateForAPI(record.startDate),
        endDate: dateUtility.formatDateForAPI(record.endDate),
        volumeUnitId: record.volumeUnitId,
        countryId: record.country.id,
        alcoholic: record.alcoholic
      };

      return payload;
    }

    $scope.saveEdit = function (exciseDuty) {
      showLoadingModal('Editing Record');
      
      $this.clearErrors();
      if ($scope.displayEditError === true) {
        $this.clearCustomErrors();
      }

      if (!dateUtility.isAfterTodayDatePicker(exciseDuty.startDate)) {
        $scope.recordToEdit.startDate = exciseDuty.startDate;
      }
      
      $scope.displayError = false;
      var dutyRateRawValue = $scope.exciseDutyEditForm.dutyRate.$$rawModelValue;
      if ($scope.isFieldEmpty($scope.recordToEdit.dutyRate) && !$scope.isFieldEmpty(dutyRateRawValue)) {
        $scope.recordToEdit.dutyRate = dutyRateRawValue;
      }

      var isDataValid =  $this.validateNewData($scope.recordToEdit);
      if (!isDataValid) {
        hideLoadingModal();
        $scope.displayEditError = true;  
        return;
      }
      
      var isValid = validateEditForm();

      if (!isValid) {
        hideLoadingModal();
        return;  
      }

      var payload = formatRecordForAPI($scope.recordToEdit);
      var companyId = globalMenuService.company.get();
      payload.companyId = companyId;
      exciseDutyFactory.updateExciseDuty($scope.recordToEdit.id, payload).then(function () {
        $scope.cancelEdit();
        reloadAfterAPISuccess();
      }, showErrors);
    };

    function validateEditForm () {
      var isValid = true;
      if (!angular.isDefined($scope.recordToEdit.commodityCode) || $scope.recordToEdit.commodityCode === '') {
        isValid = false;  
        $scope.exciseDutyEditForm.editCommodityCode.$valid = false;
      }

      if (!angular.isDefined($scope.recordToEdit.dutyRate) || $scope.recordToEdit.dutyRate === '') {
        isValid = false;  
        $scope.exciseDutyEditForm.editDutyRate.$valid = false;
      }

      $scope.displayEditError = !isValid;
      return isValid;
    }

    $scope.cancelEdit = function () {
      $scope.errorResponse = [];
      $scope.errorResponseEdit = [];
      $this.clearErrors();
      $scope.inEditMode = false;
      $scope.recordToEdit = null;
      hideErrors();
    };

    $scope.canEdit = function (exciseDuty) {
      return dateUtility.isTodayDatePicker(exciseDuty.endDate) || dateUtility.isAfterTodayDatePicker(exciseDuty.endDate);
    };

    $scope.isSelectedToEdit = function (exciseDuty) {
      return ($scope.inEditMode && exciseDuty.id === $scope.recordToEdit.id);
    };

    $scope.selectToEdit = function (exciseDuty) {
      $scope.recordToEdit = angular.copy(exciseDuty);
      var countryMatch = lodash.findWhere($scope.countryList, { id: exciseDuty.countryId });
      $scope.recordToEdit.country = countryMatch;
      $scope.inEditMode = true;
    };

    function createSuccess() {
      if ($scope.search && $scope.search.commodityCode) {
        $scope.search = { commodityCode: $scope.search.commodityCode + ',' + $scope.newRecord.commodityCode };
      } else {
        $scope.search = { commodityCode: $scope.newRecord.commodityCode };
      }

      hideLoadingModal();
      $scope.clearCreateForm(false);
      $scope.searchExciseData();
    }

    function validateCreateForm() {
      var isValid = !!$scope.newRecord.country;
      $scope.exciseDutyCreateForm.country.$setValidity('required', isValid);
      $scope.exciseDutyCreateForm.commodityCode.$setValidity('required', !!$scope.newRecord.commodityCode);

      var dutyRateRawValue = $scope.exciseDutyCreateForm.dutyRate.$$rawModelValue;
      if ($scope.isFieldEmpty($scope.newRecord.dutyRate) && !$scope.isFieldEmpty(dutyRateRawValue)) {
        $scope.newRecord.dutyRate = dutyRateRawValue;
      }

      $scope.exciseDutyCreateForm.dutyRate.$setValidity('required', !!$scope.newRecord.dutyRate);
      $scope.exciseDutyCreateForm.volumetricUnit.$setValidity('required', !!$scope.newRecord.volumeUnitId);

      $scope.displayError = !isValid;
      if (isValid) {
        $scope.displayError = !$scope.exciseDutyCreateForm.$valid;
      }
    }

    $scope.createExciseDuty = function () {
      $scope.errorCustom = [];
      if ($scope.inEditMode) {
        var errPayload = {
          value: 'You are in edit mode. Please exit the edit mode and try again!'
        };

        $scope.errorCustom.push(errPayload);
        $scope.displayEditError = true;

        return;
      }

      hideErrors();
      var dutyRateRawValue = $scope.exciseDutyCreateForm.dutyRate.$$rawModelValue;
      if ($scope.isFieldEmpty($scope.newRecord.dutyRate) && !$scope.isFieldEmpty(dutyRateRawValue)) {
        $scope.newRecord.dutyRate = dutyRateRawValue;
      }
      
      var isDataValid =  $this.validateNewData($scope.newRecord);
      if (!isDataValid) {
        $scope.displayError = true;  
        return;
      }

      validateCreateForm();
      if ($scope.exciseDutyCreateForm.$valid) {
        var payload = formatRecordForAPI($scope.newRecord);
        showLoadingModal('Creating New Record');
        exciseDutyFactory.createExciseDuty(payload).then(createSuccess, showErrors);
      }
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
      hideLoadingModal();
      $this.meta.count = $this.meta.count || dataFromAPI.meta.count;

      var newExciseDutyList = angular.copy(dataFromAPI.response);
      angular.forEach(newExciseDutyList, function (exciseDuty) {
        exciseDuty.startDate = dateUtility.formatDateForApp(exciseDuty.startDate);
        exciseDuty.endDate = dateUtility.formatDateForApp(exciseDuty.endDate);
        var countryMatch = lodash.findWhere($scope.countryList, { id: exciseDuty.countryId });
        var volumeMatch = lodash.findWhere($scope.volumeUnits, { id: exciseDuty.volumeUnitId });
        exciseDuty.countryName = (angular.isDefined(countryMatch)) ? countryMatch.countryName : '';
        exciseDuty.volumeUnit = (angular.isDefined(volumeMatch)) ? (volumeMatch.unitName + ' (' + volumeMatch.unitCode + ')') : '';
        exciseDuty.dutyRate = parseFloat(exciseDuty.dutyRate).toFixed(2);
      });

      $scope.exciseDutyList = ($scope.exciseDutyList) ? $scope.exciseDutyList.concat(newExciseDutyList) : newExciseDutyList;
    }

    $scope.getExciseDutyList = function () {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      var payload = formatSearchPayloadForAPI();
      lodash.assign(payload, {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        sortOn: 'country.countryName,commodityCode,startDate',
        sortBy: 'ASC'
      });

      payload.limit = $this.meta.limit;
      payload.offset = $this.meta.offset;

      exciseDutyFactory.getExciseDutyList(payload).then(formatExciseDutyResponseForApp, showErrors);

      $this.meta.offset += $this.meta.limit;
    };

    function completeInit(responseArray) {
      $scope.countryList = angular.copy(responseArray[0].countries);
      $scope.volumeUnits = lodash.filter(angular.copy(responseArray[1].units), function (record) {
        return (record.unitCode === 'l' || record.unitCode === 'hl');
      });

      $scope.baseCurrency = angular.copy(responseArray[2].currencyCode);

      hideLoadingModal();
    }

    function callInitAPIs(companyDataFromAPI) {
      var promises = [
        exciseDutyFactory.getCountriesList(),
        exciseDutyFactory.getVolumeUnits(),
        exciseDutyFactory.getCurrency(angular.copy(companyDataFromAPI.baseCurrencyId))
      ];

      $q.all(promises).then(completeInit, showErrors);
    }

    function init() {
      showLoadingModal('initializing');
      $scope.isCRUD = accessService.crudAccessGranted('EXCISEDUTY', 'EXCISEDUTY', 'CUDEXCDT');
      initLazyLoadingMeta();
      $scope.newRecord = { alcoholic: false };
      $scope.search = null;
      $scope.recordToEdit = null;
      $scope.inEditMode = false;
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var companyId = globalMenuService.company.get();
      exciseDutyFactory.getCompanyData(companyId).then(callInitAPIs, showErrors);
    }

    init();

    this.clearErrors = function () {
      $scope.displayError = false;
      $scope.displayEditError = false;
      $scope.errorResponse = [];
      $scope.errorResponseEdit = [];
      $scope.errorCustom = [];
    };

    $scope.isCurrentEffectiveDate = function (date) {
      return (dateUtility.isTodayOrEarlierDatePicker(date.startDate) && dateUtility.isAfterTodayDatePicker(date.endDate));
    };

    $scope.isFieldEmpty = function (value) {
      return (value === undefined || value === null || value.length === 0 || value === 'Invalid date');
    };

    this.validateNewData = function (record) {//newRecord.country
      var validateCntry = $this.validateNewDataField(record, 'country', 'Country');
      var validateCcode = $this.validateNewDataField(record, 'commodityCode', 'Commodity Code');
      var validateSdate = $this.validateNewDataField(record, 'startDate', 'Start Date');
      var validateEdate = $this.validateNewDataField(record, 'endDate', 'End Date');
      var isValidDrange = true;
      if (record !== null && !$scope.isFieldEmpty(record.endDate) && !$scope.isFieldEmpty(record.startDate)) {
        isValidDrange = $this.validateStartAndEndDates(record);
      }
      
      var validateDrate = $this.validateNewDataField(record, 'dutyRate', 'Duty Rate');
      var validateDrateChar = true;
      if (record !== null && validateDrate && $scope.isDutyRateValueInvalid(record)) {
        $this.showValidationError('Duty Rate', true);
        validateDrateChar = false;
      }

      var validateVMeasure = $this.validateNewDataField(record, 'volumeUnitId', 'Volumetric Measure');
        
      return validateCntry && validateCcode && validateSdate && validateEdate && isValidDrange && validateDrate && validateDrateChar && validateVMeasure;
    };

    $scope.isDutyRateValueInvalid = function (record) {
      var isInvalid = false; 
      if (record !== null && angular.isDefined(record.dutyRate)) {	
        isInvalid =  !record.dutyRate || (record.dutyRate && !record.dutyRate.match(/^\d{0,6}(\.\d{0,2})?$/));
      }

      return isInvalid;
    };    

    this.validateNewDataField = function (record, fieldName, fieldValidationName) {
      var result = true;

      if (record !== null && $scope.isFieldEmpty(record[fieldName])) {
        $this.showValidationError(fieldValidationName, false);
        result = false;
      }

      return result;
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

    $scope.isDateValueInvalid = function (value, record) {
      var isInValid = $scope.isFieldEmpty(value) || (record.startDate && record.endDate && dateUtility.isAfterDatePicker(record.startDate, record.endDate));
      return isInValid;
    };

    $scope.isDateValueRangeInvalid = function (record) {
      var isInValid = dateUtility.isAfterDatePicker(record.startDate, record.endDate);
      return isInValid;
    };

  });
