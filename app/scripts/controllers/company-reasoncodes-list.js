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

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $scope.isCRUD = accessService.crudAccessGranted('SURVEY', 'SURVEY', 'SURVEY');
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });
    };

    this.init();
  });
