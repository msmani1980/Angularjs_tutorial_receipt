'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyCtrl
 * @description
 * # SurveyCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyCatalogCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, surveyCatalogFactory) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Manage Survey Catalog';
    $scope.search = {};
    $scope.surveys = [];
    $scope.loadingBarVisible = false;
    $scope.isSearch = false;
    $scope.surveyTypes = [];

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
      $scope.surveyCatalogs = [];
    };

    this.getSurveyCatalogsSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.surveyCatalogs = $scope.surveyCatalogs.concat(response.surveyCatalogs.map(function (surveyCatalog) {
        surveyCatalog.startDate = dateUtility.formatDateForApp(surveyCatalog.startDate);
        surveyCatalog.endDate = dateUtility.formatDateForApp(surveyCatalog.endDate);

        return surveyCatalog;
      }));

      hideLoadingBar();
    };

    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    $scope.loadSurveyCatalogs = function() {
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

      surveyCatalogFactory.getSurveyCatalogs(payload).then($this.getSurveyCatalogsSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchSurveyCatalogData = function() {
      $scope.surveyCatalogs = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;

      $scope.loadSurveyCatalogs();
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

    $scope.redirectToSurveyCatalog = function(id, state) {
      $location.search({});
      $location.path('survey/catalog/' + state + '/' + id).search();
    };

    this.deleteSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Survey Catalog', 'Survey Catalog successfully deleted');
      $scope.surveyCatalogs = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadSurveys();
    };

    this.deleteFailure = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('danger', 'Survey Catalog', 'Survey Catalog could not be deleted');
    };

    $scope.isSurveyCatalogEditable = function(survey) {
      if (angular.isUndefined(survey)) {
        return false;
      }

      return dateUtility.isAfterOrEqualDatePicker(survey.endDate, dateUtility.nowFormattedDatePicker());
    };

    $scope.showDeleteButton = function(dateString) {
      return dateUtility.isAfterTodayDatePicker(dateString);
    };

    $scope.removeRecord = function (survey) {

      $this.displayLoadingModal('Removing Survey Catalog Record');

      surveyCatalogFactory.deleteSurvey(survey.id).then(
        $this.deleteSuccess,
        $this.deleteFailure
      );
    };

    this.makeInitPromises = function() {
      var promises = [
        surveyCatalogFactory.getSurveyTypes().then($this.getSurveyTypesSuccess)
      ];
      return promises;
    };

    this.init = function() {
      var initDependencies = $q();
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });
    };

    this.init();

  });
