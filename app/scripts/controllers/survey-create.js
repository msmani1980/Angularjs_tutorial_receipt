'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyCreateCtrl
 * @description
 * # SurveyCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, surveyFactory, $filter) {

    var $this = this;
    $scope.viewName = 'Survey';
    $scope.survey = {
      startDate: '',
      endDate: ''
    };
    $scope.surveyQuestionList = [];
    $scope.surveyTypes = [];
    $scope.viewStartDate = '';
    $scope.viewEndDate = '';
    $scope.disablePastDate = false;
    $scope.shouldDisableEndDate = false;
    $scope.surveyQuestionItemList = [];

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Create Survey';
      $scope.viewEditItem = false;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Survey';
      $scope.viewEditItem = true;
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Survey';
      $scope.viewEditItem = true;
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.surveyDataForm.$valid;
    };

    this.resetErrors = function() {
      $scope.formErrors = [];
      $scope.errorCustom = [];
      $scope.displayError = false;
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.saveFormSuccess = function() {
      $this.hideLoadingModal();
      if ($routeParams.action === 'create') {
        $this.showToastMessage('success', 'Create Survey', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Survey', 'success');
      }

      $location.path('survey');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.getSurveyQuestionsSuccess = function(response) {
      $this.hideLoadingModal();
      $scope.surveyQuestionList = angular.copy(response.response);
    };

    function getFilteredQuestions(startDate, endDate) {
      $this.showLoadingModal('Loading Questions');
      var searchPayload = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate)
      };

      surveyFactory.getSurveyQuestions(searchPayload).then($this.getSurveyQuestionsSuccess, $this.saveFormFailure);
    }
    
    $scope.addSurveyQuestionRow = function () {
      if (!$scope.survey.startDate && !$scope.survey.endDate) {
        messageService.display('warning', 'Please select a date range first!', 'Add Question');
        return;
      }

      var nextIndex = $scope.surveyQuestionItemList.length;
      $scope.surveyQuestionItemList.push({ surveyIndex: nextIndex });
    };
    
    $scope.$watchGroup(['survey.startDate', 'survey.endDate'], function () {
      if ($scope.survey && $scope.survey.startDate && $scope.survey.endDate) {
        getFilteredQuestions($scope.survey.startDate, $scope.survey.endDate);
      }
    });
    
    this.formatQuestionsForAPI = function () {
      var questionsArray = [];

      angular.forEach($scope.surveyQuestionItemList, function (questionItem) {
        var itemPayload = {};
        if (questionItem.id) {
          itemPayload.id = questionItem.id;
        }

        itemPayload.surveyQuestionId = questionItem.surveyQuestionId;
        itemPayload.hideOnEpos = questionItem.hideOnEpos;
        itemPayload.sortOrder = parseInt(questionItem.sortOrderIndex);
        questionsArray.push(itemPayload);
      });

      return questionsArray;
    };

    $scope.removeItem = function (itemIndex) {
      $scope.surveyQuestionItemList.splice(itemIndex, 1);

      angular.forEach($scope.surveyQuestionItemList, function (itemQuestion, index) {
        itemQuestion.surveyIndex = index;
      });

    };

    this.createSurvey = function() {
      $this.showLoadingModal('Creating Survey Data');

      var payload = {
        companyId: surveyFactory.getCompanyId(),
        surveyName: $scope.survey.surveyName,
        surveyTypeId: $scope.survey.surveyTypeId,
        startDate: dateUtility.formatDateForAPI($scope.survey.startDate),
        endDate: dateUtility.formatDateForAPI($scope.survey.endDate),
        surveyQuestions: $this.formatQuestionsForAPI()
      };

      surveyFactory.createSurvey(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.editSurvey = function() {
      $this.showLoadingModal('Saving Survey Data');

      var payload = {
        id: $routeParams.id,
        companyId: surveyFactory.getCompanyId(),
        surveyName: $scope.survey.surveyName,
        surveyTypeId: $scope.survey.surveyTypeId,
        startDate: dateUtility.formatDateForAPI($scope.survey.startDate),
        endDate: dateUtility.formatDateForAPI($scope.survey.endDate),
        surveyQuestions: $this.formatQuestionsForAPI()
      };

      surveyFactory.updateSurvey(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.setMinDateValue = function () {
      if ($scope.viewEditItem) {
        $scope.survey.startDate = $scope.viewStartDate;
        $scope.survey.endDate = $scope.viewEndDate;
      }

    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'Survey');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

    this.getSurveyTypesSuccess = function(response) {
      $scope.surveyTypes = response;
    };
 
    this.makeInitPromises = function() {
      var promises = [
        surveyFactory.getSurveyTypes().then($this.getSurveyTypesSuccess)
      ];
      return promises;
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.deSerializeSurveyQuestions = function(questionsList) {
      $scope.surveyQuestionItemList = [];

      angular.forEach(questionsList, function (item) {
        var newItem = {
          id: item.id,
          surveyQuestionId: item.surveyQuestionId,
          hideOnEpos: item.hideOnEpos,
          sortOrder: item.sortOrder
        };
        $scope.surveyQuestionItemList.push(newItem);
      });

      $scope.surveyQuestionItemList = $filter('orderBy')($scope.surveyQuestionItemList, 'sortOrder');
    };

    this.getSurveySuccess = function(response) {
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);

      $scope.disablePastDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);

      $scope.survey = {
        id: response.id,
        surveyName: response.surveyName,
        surveyTypeId: response.surveyTypeId,
        startDate: $scope.viewStartDate,
        endDate: $scope.viewEndDate,
        surveyQuestions: $this.deSerializeSurveyQuestions(response.surveyQuestions)
      };
    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        surveyFactory.getSurvey($routeParams.id).then($this.getSurveySuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

      $this.setMinDateValue();
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();
  });
