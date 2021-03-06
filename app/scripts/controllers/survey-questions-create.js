'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyQuestionsCreateCtrl
 * @description
 * # SurveyQuestionsCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyQuestionsCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, surveyQuestionsFactory, $filter) {
    var $this = this;
    var draggedSurveyItemObject;
    var draggedOntoItemIndex;

    $scope.viewName = 'Survey Question';
    $scope.shouldDisableEndDate = false;
    $scope.displayError = false;
    $scope.surveyChoiceTypes = [
      { id: 0, name: 'Free Form' },
      { id: 1, name: 'Single Choice' },
      { id: 2, name: 'Multi Choice' }
    ];
    $scope.surveyQuestion = {};
    $scope.surveyChoices = [];
    $scope.dragging = false;

    $scope.addSurveyChoiceRow = function () {
      var nextIndex = $scope.surveyChoices.length;
      $scope.surveyChoices.push({ surveyIndex: nextIndex });
    };

    $scope.removeItem = function (itemIndex) {
      $scope.surveyChoices.splice(itemIndex, 1);

      angular.forEach($scope.surveyChoices, function (itemChoice, index) {
        itemChoice.surveyChoiceIndex = index;
      });

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

    $scope.isDisabled = function() {
      return $scope.shouldDisableStartDate || $scope.readOnly;
    };

    $scope.isSurveyQuestionEditable = function () {
      if ($routeParams.action === 'create') {
        return true;
      }

      if ($routeParams.action === 'view' || angular.isUndefined($scope.surveyQuestion)) {
        return false;
      }

      return dateUtility.isAfterTodayDatePicker($scope.surveyQuestion.startDate);
    };

    $scope.dropSuccess = function ($event, index, array) {
      if (typeof draggedOntoItemIndex !== 'undefined' && typeof draggedSurveyItemObject !== 'undefined' && draggedOntoItemIndex !== null && draggedSurveyItemObject !== null)
      {
        var tempItemObject = array[draggedOntoItemIndex];
        array.splice(draggedOntoItemIndex, 1, draggedSurveyItemObject);
        array.splice(index, 1, tempItemObject);
        draggedSurveyItemObject = null;
        for (var i = 0; i < array.length; i++)
        {
          array[i].sortOrderIndex = i;
          array[i].sortOrder = i;
          array[i].orderBy = i;
        }
      } else {
        draggedSurveyItemObject = null;
        draggedOntoItemIndex = null;
        messageService.display('warning', 'Please drag and drop only inside the Add Choices list', 'Drag to reorder');
      }
    };

    $scope.onDrop = function ($event, $data, index) {
      draggedOntoItemIndex = index;
      draggedSurveyItemObject = $data;
    };

    $scope.$on('ANGULAR_DRAG_START', function () {
      $scope.dragging = true;
    });

    $scope.$on('ANGULAR_DRAG_END', function () {
      $scope.dragging = false;
    });

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.editingItem = false;
      $scope.isLoadingCompleted = true;
      $scope.viewName = 'Create Survey Question';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.editingItem = true;
      $scope.viewName = 'View Survey Question';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.editingItem = true;
      $scope.viewName = 'Edit Survey Question';
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

      $location.path('survey-questions');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.formatChoicesForAPI = function () {
      var questionsArray = [];

      angular.forEach($scope.surveyChoices, function (choiceItem) {
        var itemPayload = {};

        if (choiceItem.id) {
          itemPayload.id = choiceItem.id;
        }

        itemPayload.choiceName = choiceItem.choiceName;
        itemPayload.orderBy = parseInt(choiceItem.sortOrderIndex);

        questionsArray.push(itemPayload);
      });

      return questionsArray;
    };

    this.createSurvey = function() {
      $this.showLoadingModal('Creating Survey Data');

      var payload = {
        companyId: surveyQuestionsFactory.getCompanyId(),
        questionName: $scope.surveyQuestion.questionName,
        questionType: $scope.surveyQuestion.questionTypeId,
        startDate: dateUtility.formatDateForAPI($scope.surveyQuestion.startDate),
        endDate: dateUtility.formatDateForAPI($scope.surveyQuestion.endDate),
        answers: $this.formatChoicesForAPI()
      };

      surveyQuestionsFactory.createSurveyQuestion(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.editSurvey = function() {
      $this.showLoadingModal('Saving Survey Question Data');

      var payload = {
        id: $routeParams.id,
        companyId: surveyQuestionsFactory.getCompanyId(),
        questionName: $scope.surveyQuestion.questionName,
        questionType: $scope.surveyQuestion.questionTypeId,
        startDate: dateUtility.formatDateForAPI($scope.surveyQuestion.startDate),
        endDate: dateUtility.formatDateForAPI($scope.surveyQuestion.endDate),
        answers: $this.formatChoicesForAPI()
      };

      surveyQuestionsFactory.updateSurveyQuestion($routeParams.id, payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.makeInitPromises = function() {
      var promises = [
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

    this.getSurveyQuestionSuccess = function(response) {
      var startDate = dateUtility.formatDateForApp(response.startDate);
      var endDate = dateUtility.formatDateForApp(response.endDate);

      $scope.shouldDisableStartDate = dateUtility.isTodayDatePicker(startDate) || !(dateUtility.isAfterTodayDatePicker(startDate));
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker(endDate);

      $scope.surveyQuestion = {
        id: response.id,
        questionTypeId: response.questionType,
        questionName: response.questionName,
        startDate: startDate,
        endDate: endDate
      };

      $this.deSerializeSurveyChoices(response.answers);

      $scope.isLoadingCompleted = true;
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
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');

      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

  });
