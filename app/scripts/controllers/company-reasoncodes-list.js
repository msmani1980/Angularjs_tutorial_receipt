'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CompanyReasoncodesListCtrl
 * @description
 * # CompanyReasoncodesListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CompanyReasoncodesListCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, companyReasoncodesFactory, accessService) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
    $scope.shouldDisableEndDate = false;
    $scope.reason = {
      startDate: '',
      endDate: ''
    };  
    $scope.viewName = 'Manage Reason Code';
    $scope.search = {};
    $scope.companyReasonCodes = [];
    $scope.loadingBarVisible = false;
    $scope.isSearch = false;
    $scope.reasonTypes = [];

    function showLoadingBar() {
      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    $scope.clearSearchForm = function() {
      $scope.isSearch = false;
      $scope.search = {};
      $scope.companyReasonCodes = [];
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    function hideFilterPanel() {
      angular.element('#search-collapse').addClass('collapse');
    }

    function showFilterPanel() {
      angular.element('#search-collapse').removeClass('collapse');
    }

    function hideCreatePanel() {
      angular.element('#create-collapse').addClass('collapse');
    }

    function showCreatePanel() {
      angular.element('#create-collapse').removeClass('collapse');
    }

    $scope.toggleFilterPanel = function() {
      if (angular.element('#search-collapse').hasClass('collapse')) {
        showFilterPanel();
        hideCreatePanel();
      } else {
        hideFilterPanel();
      }
    };

    $scope.toggleCreatePanel = function() {
      if (angular.element('#create-collapse').hasClass('collapse')) {
        showCreatePanel();
        hideFilterPanel();
      } else {
        hideCreatePanel();
      }
    };

    this.refreshDataGrid = function() {
      $this.hideLoadingModal();
      $scope.companyReasonCodes = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadCompanyReasonCodes();
    };

    this.saveFormSuccess = function() {
      $this.showToastMessage('success', 'Create Company Reason Code', 'Company Reason Code successfully created');
      $this.refreshDataGrid();
      $scope.clearCreateForm();
      hideCreatePanel();
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.getCompanyReasonCodesSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.companyReasonCodes = $scope.companyReasonCodes.concat(response.companyReasonCodes.map(function (reason) {
        reason.startDate = dateUtility.formatDateForApp(reason.startDate);
        reason.endDate = dateUtility.formatDateForApp(reason.endDate);

        return reason;
      }));

      hideLoadingBar();
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    $scope.loadCompanyReasonCodes = function() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }

      showLoadingBar();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });
    
      payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;

      companyReasoncodesFactory.getCompanyReasonCodes(payload).then($this.getCompanyReasonCodesSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    this.getReasonTypesSuccess = function(response) {
      $scope.reasonTypes = response.companyReasonTypes;
    };

    $scope.searchCompanyReasonCodeData = function() {
      $scope.companyReasonCodes = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;
      $scope.loadCompanyReasonCodes();
    };

    $scope.isUpdatable = function (reason) {
      return dateUtility.isAfterTodayDatePicker(reason.startDate);
    };

    $scope.cancelEdit = function () {
      $scope.inEditMode = false;
      $scope.recordToEdit = null;
      $scope.displayError = false;
    };

    $scope.isSelectedToEdit = function (reason) {
      return ($scope.inEditMode && reason.id === $scope.recordToEdit.id);
    };

    $scope.selectToEdit = function (reason) {
      $scope.recordToEdit = angular.copy(reason);
      $scope.inEditMode = true;
      $scope.startDateTemp = $scope.recordToEdit.startDate;
    };

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    $scope.redirectToCompanyReason = function(id, state) {
      $location.search({});
      $location.path('survey/' + state + '/' + id).search();
    };

    $scope.clearCreateForm = function() {
      $scope.reason = {};
    };

    this.deleteSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Company Reason Code', 'Company Reason Code successfully deleted');
      $scope.companyReasonCodes = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadCompanyReasonCodes();
    };

    this.deleteFailure = function() {
      $this.hideLoadingModal();  
      $this.showToastMessage('danger', 'Company Reason Code', 'Company Reason Code could not be deleted');
    };

    $scope.isCompanyReasonCodeEditable = function(reason) {
      if (angular.isUndefined(reason)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(reason.endDate, dateUtility.nowFormattedDatePicker());
    };

    $scope.showDeleteButton = function(dateString) {
      return dateUtility.isAfterTodayDatePicker(dateString);
    };

    $scope.removeRecord = function (reason) {
      $this.displayLoadingModal('Removing Company Reason Code Record');
      companyReasoncodesFactory.deleteCompanyReasonCode(reason.id).then($this.deleteSuccess, $this.deleteFailure);
    };

    this.makeInitPromises = function() {
      var promises = [
        companyReasoncodesFactory.getReasonTypes().then($this.getReasonTypesSuccess)
      ];
      return promises;
    };

    this.formatPayLoad = function(record) {
      var payload = {
        companyReasonCodeName: record.companyReasonCodeName,
        companyReasonTypeId: record.companyReasonTypeId,
        isDefault: record.isDefault ? 1 : null,
        startDate: record.startDate === '' ? dateUtility.formatDateForAPI($scope.startDateTemp) : dateUtility.formatDateForAPI(record.startDate),
        endDate: dateUtility.formatDateForAPI(record.endDate)
      };

      return payload;
    };

    this.saveUpdateForm = function() {
      $this.showToastMessage('success', 'Update Company Reason Code', 'Company Reason Code successfully updated');
      $scope.cancelEdit();
      $this.refreshDataGrid();
    };

    $scope.editCompanyReasonCode = function () {
      $this.showLoadingModal('Updating Company Reason Code Record');
      var payload = $this.formatPayLoad($scope.recordToEdit);
      payload.id = $scope.recordToEdit.id;
      companyReasoncodesFactory.updateCompanyReasonCode(payload).then($this.saveUpdateForm, $this.saveFormFailure);
    };

    $scope.createCompanyReasonCode = function() {
      if ($scope.companyReasonCreateForm.$valid) {
        $this.showLoadingModal('Creating Company Reason Code Data');
        var payload = $this.formatPayLoad($scope.reason);
        companyReasoncodesFactory.createCompanyReasonCode(payload).then($this.saveFormSuccess, $this.saveFormFailure);
      } else {
        $scope.displayError = true;
      }
    };

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $scope.isCRUD = accessService.crudAccessGranted('COMPANYREASON', 'COMPANYREASON', 'CRUDCMPRSN');
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });
    };

    this.init();
  });
