'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyCtrl
 * @description
 * # SurveyCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyCtrl', function ($scope, $q, $location, dateUtility, lodash, messageService, surveyFactory) {

    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };
      
    $scope.viewName = 'Manage Survey';
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
      $scope.surveys = [];
    };

    this.getSurveysSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;
      $scope.surveys = $scope.surveys.concat(response.surveys.map(function (survey) {
        survey.startDate = dateUtility.formatDateForApp(survey.startDate);
        survey.endDate = dateUtility.formatDateForApp(survey.endDate);

        return survey;
      }));

      hideLoadingBar();
    };
     
    this.constructStartDate = function () {
      return ($scope.isSearch) ? null : dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
    };
      
    $scope.loadSurveys = function() {
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
          
      surveyFactory.getSurveys(payload).then($this.getSurveysSuccess);
      $this.meta.offset += $this.meta.limit;
    };

    this.getSurveyTypesSuccess = function(response) {
      $scope.surveyTypes = response;
    };
      
    $scope.searchSurveyData = function() {
      $scope.surveys = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };

      $scope.isSearch = true;

      $scope.loadSurveys();
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

    this.deleteSuccess = function() {
      $this.hideLoadingModal();
      $this.showToastMessage('success', 'Survey', 'Survey successfully deleted');
      $scope.surveys = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadSurveys();
    };

    this.deleteFailure = function() {
      $this.hideLoadingModal();  
      $this.showToastMessage('danger', 'Survey', 'Survey could not be deleted');
    };

    $scope.removeRecord = function (survey) {

      $this.displayLoadingModal('Removing Survey Record');

      surveyFactory.deleteSurvey(survey.id).then(
        $this.deleteSuccess, 
        $this.deleteFailure
      );
    };
    
    this.makeInitPromises = function() {
      var promises = [
        surveyFactory.getSurveyTypes().then($this.getSurveyTypesSuccess)
      ];
      return promises;
    };

    this.init = function() {
      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
        angular.element('#search-collapse').addClass('collapse');
      });
    };

    this.init();
      
  });
