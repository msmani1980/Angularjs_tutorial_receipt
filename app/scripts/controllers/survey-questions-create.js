'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyQuestionsCreateCtrl
 * @description
 * # SurveyQuestionsCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyQuestionsCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, surveyQuestionsFactory, surveyChoicesFactory, $filter) {
    var $this = this;
    var draggedChoicesObject;
    var draggedOntoChoicesIndex;

    $scope.viewName = 'Survey';
    $scope.disablePastDate = false;
    $scope.shouldDisableEndDate = false;
    $scope.disablePastDate = false;
    $scope.shouldDisableEndDate = false;
    $scope.surveyChoiceTypes = [
      { id: 0, name: 'Free Form' },
      { id: 1, name: 'Single Choice' },
      { id: 2, name: 'Multi Choice' }
    ];

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewEditItem = false;
      $scope.viewName = 'Create Survey Question';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewEditItem = true;
      $scope.viewName = 'View Survey Question';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewEditItem = true;
      $scope.viewName = 'Edit Survey Question';
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.surveyQuestionDataForm.$valid;
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
        $this.showToastMessage('success', 'Create Survey Question', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Survey Question', 'success');
      }

      $location.path('survey');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.getSurveyChoicesSuccess = function(response) {
      $this.hideLoadingModal();
      $scope.surveyChoices = angular.copy(response.response);
    };

    this.getSurveyChoices = function() {
      $this.showLoadingModal('Loading Choices');
      var searchPayload = { };

      surveyChoicesFactory.getSurveyChoices(searchPayload).then($this.getSurveyChoicesSuccess, $this.saveFormFailure);
    };

    $scope.addSurveyChoiceRow = function () {
      var nextIndex = $scope.surveyChoices.length;
      $scope.surveyChoices.push({ surveyIndex: nextIndex });
    };

    this.formatChoicesForAPI = function () {
      var questionsArray = [];

      angular.forEach($scope.surveyChoices, function (choiceItem) {
        var itemPayload = {};
        if (choiceItem.id) {
          itemPayload.id = choiceItem.id;
        }

        itemPayload.surveyQuestionId = choiceItem.surveyQuestionId;
        itemPayload.hideOnEpos = choiceItem.hideOnEpos;
        itemPayload.orderBy = parseInt(choiceItem.orderByIndex);
        questionsArray.push(itemPayload);
      });

      return questionsArray;
    };

    $scope.removeItem = function (itemIndex) {
      $scope.surveyChoices.splice(itemIndex, 1);

      angular.forEach($scope.surveyChoices, function (itemChoice, index) {
        itemChoice.surveyChoiceIndex = index;
      });

    };

    this.createSurvey = function() {
      $this.showLoadingModal('Creating Survey Data');

      var payload = {
        companyId: surveyQuestionsFactory.getCompanyId(),
        questionName: $scope.surveyQuestion.questionName,
        questionTypeId: $scope.surveyQuestion.questionTypeId,
        startDate: dateUtility.formatDateForAPI($scope.questionTypeId.startDate),
        endDate: dateUtility.formatDateForAPI($scope.questionTypeId.endDate),
        answers: $this.formatChoicesForAPI()
      };

      surveyQuestionsFactory.createSurveyQuestion(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.editSurvey = function() {
      $this.showLoadingModal('Saving Survey Data');

      var payload = {
        id: $routeParams.id,
        companyId: surveyQuestionsFactory.getCompanyId(), // TODO: add company id
        questionName: $scope.surveyQuestion.questionName,
        questionTypeId: $scope.surveyQuestion.questionTypeId,
        startDate: dateUtility.formatDateForAPI($scope.surveyQuestion.startDate),
        endDate: dateUtility.formatDateForAPI($scope.surveyQuestion.endDate),
        answers: $this.formatChoicesForAPI()
      };

      surveyQuestionsFactory.updateSurveyQuestion(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.setMinDateValue = function () {
      if ($scope.viewEditItem) {
        $scope.surveyQuestion.startDate = $scope.viewStartDate;
        $scope.surveyQuestion.endDate = $scope.viewEndDate;
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

    this.makeInitPromises = function() {
      var promises = [
        $this.getSurveyChoices()
      ];
      return promises;
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.deSerializeSurveyChoices = function(choices) {
      $scope.surveyChoices = [];

      angular.forEach(choices, function (item, index) {
        var newItem = {
          id: item.id,
          choiceName: item.choiceName,
          surveyChoiceIndex: index,
          selectedItem: item,
          orderBy: item.orderBy
        };
        $scope.surveyChoices.push(newItem);
      });

      $scope.surveyChoices = $filter('orderBy')($scope.surveyChoices, 'orderBy');
    };

    $scope.dropSuccess = function ($event, index, array) {
      if (draggedOntoChoicesIndex !== null && draggedChoicesObject !== null)
      {
        var tempItemObject = array[draggedOntoChoicesIndex];
        array.splice(draggedOntoChoicesIndex, 1, draggedChoicesObject);
        array.splice(index, 1, tempItemObject);
        draggedChoicesObject = null;
        for (var i = 0; i < array.length; i++)
        {
          array[i].orderByIndex = i;
          array[i].orderBy = i;
        }
      } else {
        draggedChoicesObject = null;
        draggedOntoChoicesIndex = null;
        messageService.display('warning', 'Please drag and drop only inside the Add Choices list', 'Drag to reorder');
      }
    };

    $scope.onDrop = function ($event, $data, index) {
      draggedOntoChoicesIndex = index;
      draggedChoicesObject = $data;
    };

    this.getSurveyQuestionSuccess = function(response) {
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);

      $scope.disablePastDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);

      $scope.surveyQuestion = {
        id: response.id,
        questionTypeId: response.questionType,
        questionName: $scope.questionName,
        startDate: dateUtility.formatDateForApp(response.startDate),
        endDate: dateUtility.formatDateForApp(response.endDate),
        surveyChoices: $this.deSerializeSurveyChoices(response.answers)
      };
    };

    this.initDependenciesSuccess = function() {
      if ($routeParams.id) {
        surveyQuestionsFactory.getSurveyQuestion($routeParams.id).then($this.getSurveyQuestionSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

      $this.setMinDateValue();

      $scope.isLoadingCompleted = true;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.minDate = dateUtility.nowFormattedDatePicker();
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
