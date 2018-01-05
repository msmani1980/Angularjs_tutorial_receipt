'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyQuestionsListCtrl
 * @description
 * # SurveyQuestionsListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyQuestionsListCtrl', function ($scope, $q, $route, $location, lodash, dateUtility, surveyQuestionsFactory) {
    var $this = this;

    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.surveyQuestions = [];
    $scope.isSearch = false;
    $scope.search = {};

    $scope.clearSearchForm = function () {
      $scope.isSearch = false;
      $scope.surveyQuestions = [];
      $scope.search = {};

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
    };

    $scope.toggleSearchPanel = function() {
      togglePanel('#search-collapse');
    };

    $scope.redirectToSurveyQuestion = function(id, state) {
      $location.search({});
      $location.path('survey-questions/' + state + '/' + id).search();
    };

    $scope.loadSurveyQuestions = function() {
      if ($this.meta.offset >= $this.meta.count || !$scope.isSearch) {
        return;
      }

      showLoadingBar();

      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset,
        sortOn: 'questionName,startDate',
        sortBy: 'ASC'
      });

      payload.startDate = (payload.startDate) ? dateUtility.formatDateForAPI(payload.startDate) : $this.constructStartDate();
      payload.endDate = (payload.endDate) ? dateUtility.formatDateForAPI(payload.endDate) : null;

      surveyQuestionsFactory.getSurveyQuestions(payload).then($this.getSurveyQuestionsSuccess);

      $this.meta.offset += $this.meta.limit;
    };

    $scope.searchSurveyQuestions = function() {
      $scope.isSearch = true;
      $scope.surveyQuestions = [];

      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.loadSurveyQuestions();
    };

    $scope.canEdit = function (endDate) {
      return dateUtility.isYesterdayOrEarlierDatePicker(endDate);
    };

    $scope.isDateActive = function (date) {
      return dateUtility.isTodayOrEarlierDatePicker(date);
    };

    $scope.removeRecord = function (surveyQuestionId) {
      $this.displayLoadingModal('Removing Survey Question');

      surveyQuestionsFactory.removeSurveyQuestion(surveyQuestionId).then($this.removeSurveyQuestionSuccess(surveyQuestionId), $this.removeSurveyQuestionFailure);
    };

    this.removeSurveyQuestionSuccess = function (surveyQuestionId) {
      lodash.remove($scope.surveyQuestions, function (surveyQuestion) {
        return surveyQuestion.id === surveyQuestionId;
      });

      $this.hideLoadingModal();
    };

    this.removeSurveyQuestionFailure = function () {
      $this.hideLoadingModal();
    };

    function togglePanel(panelName) {
      isPanelOpen(panelName) ? hidePanel(panelName) : showPanel(panelName); // jshint ignore:line
    }

    function isPanelOpen(panelName) {
      return !angular.element(panelName).hasClass('collapse');
    }

    function hidePanel(panelName) {
      if (!isPanelOpen(panelName)) {
        return;
      }

      angular.element(panelName).addClass('collapse');
    }

    function showPanel(panelName) {
      angular.element(panelName).removeClass('collapse');
    }

    function showLoadingBar() {
      if (!$scope.isSearch) {
        return;
      }

      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

    this.displayLoadingModal = function (loadingText) {
      angular.element('#loading').modal('show').find('p').text(loadingText);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.constructStartDate = function () {
      return dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };

    this.getSurveyQuestionsSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.surveyQuestions = $scope.surveyQuestions.concat(response.response.map(function (surveyQuestion) {
        surveyQuestion.startDate = dateUtility.formatDateForApp(surveyQuestion.startDate);
        surveyQuestion.endDate = dateUtility.formatDateForApp(surveyQuestion.endDate);

        return surveyQuestion;
      }));

      hideLoadingBar();
    };

    this.makeInitPromises = function() {
      var promises = [
        $scope.loadSurveyQuestions()
      ];

      return promises;
    };

    this.init = function() {
      angular.element('.loading-more').hide();

      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
        $scope.uiReady = true;
      });

    };

    this.init();
  });
