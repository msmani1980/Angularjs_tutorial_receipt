'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:SurveyCatalogCreateCtrl
 * @description
 * # SurveyCatalogCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('SurveyCatalogCreateCtrl', function ($scope, $q, $location, dateUtility, $routeParams, messageService, surveyCatalogFactory, surveyFactory, $filter) {

    var $this = this;
    $scope.viewName = 'Survey';
    $scope.surveyCatalog = {
      startDate: '',
      endDate: ''
    };
    $scope.surveyList = [];
    $scope.viewStartDate = '';
    $scope.viewEndDate = '';
    $scope.disablePastDate = false;
    $scope.shouldDisableEndDate = false;
    $scope.surveyItemList = [];
    var draggedSurveyItemObject;
    var draggedOntoIemIndex;

    this.createInit = function() {
      $scope.readOnly = false;
      $scope.isCreate = true;
      $scope.viewName = 'Create Survey Catalog';
      $scope.viewEditItem = false;
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Survey Catalog';
      $scope.viewEditItem = true;
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Survey Catalog';
      $scope.viewEditItem = true;
    };

    $scope.isDisabled = function() {
      return $scope.disablePastDate || $scope.readOnly;
    };

    this.validateForm = function() {
      $this.resetErrors();
      return $scope.surveyCatalogDataForm.$valid;
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
        $this.showToastMessage('success', 'Create Survey Catalog', 'success');
      } else {
        $this.showToastMessage('success', 'Edit Survey Catalog', 'success');
      }

      $location.path('survey-catalog');
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.getSurveysSuccess = function(response) {
      $this.hideLoadingModal();
      $scope.surveyList = angular.copy(response.surveys);
    };

    function getFilteredSurveys(startDate, endDate) {
      $this.showLoadingModal('Loading Surveys');
      var searchPayload = {
        startDate: dateUtility.formatDateForAPI(startDate),
        endDate: dateUtility.formatDateForAPI(endDate)
      };

      surveyFactory.getSurveys(searchPayload).then($this.getSurveysSuccess, $this.saveFormFailure);
    }

    $scope.addSurveyRow = function () {
      if (!$scope.surveyCatalog.startDate && !$scope.surveyCatalog.endDate) {
        messageService.display('warning', 'Please select a date range first!', 'Add Survey');
        return;
      }

      var nextIndex = $scope.surveyItemList.length;
      $scope.surveyItemList.push({ surveyIndex: nextIndex });
    };

    $scope.$watchGroup(['surveyCatalog.startDate', 'surveyCatalog.endDate'], function () {
      if ($scope.surveyCatalog && $scope.surveyCatalog.startDate && $scope.surveyCatalog.endDate) {
        getFilteredSurveys($scope.surveyCatalog.startDate, $scope.surveyCatalog.endDate);
      }
    });

    this.formatSurveysForAPI = function () {
      var resultArray = [];

      angular.forEach($scope.surveyItemList, function (item) {
        var itemPayload = {};
        if (item.id) {
          itemPayload.id = item.id;
        }

        itemPayload.surveyId = item.surveyId;
        itemPayload.orderBy = parseInt(item.sortOrderIndex);
        resultArray.push(itemPayload);
      });

      return resultArray;
    };

    $scope.removeItem = function (itemIndex) {
      $scope.surveyItemList.splice(itemIndex, 1);

      angular.forEach($scope.surveyItemList, function (item, index) {
        item.surveyIndex = index;
      });
    };

    this.createSurveyCatalog = function() {
      $this.showLoadingModal('Creating Survey Catalog Data');

      var payload = {
        companyId: surveyFactory.getCompanyId(),
        catalogName: $scope.surveyCatalog.catalogName,
        startDate: dateUtility.formatDateForAPI($scope.surveyCatalog.startDate),
        endDate: dateUtility.formatDateForAPI($scope.surveyCatalog.endDate),
        surveys: $this.formatSurveysForAPI()
      };

      surveyCatalogFactory.createSurveyCatalog(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.editSurveyCatalog = function() {
      $this.showLoadingModal('Saving Survey Catalog Data');

      var payload = {
        id: $routeParams.id,
        companyId: surveyFactory.getCompanyId(),
        catalogName: $scope.surveyCatalog.catalogName,
        startDate: dateUtility.formatDateForAPI($scope.surveyCatalog.startDate),
        endDate: dateUtility.formatDateForAPI($scope.surveyCatalog.endDate),
        surveys: $this.formatSurveysForAPI()
      };

      surveyCatalogFactory.updateSurveyCatalog(payload).then($this.saveFormSuccess, $this.saveFormFailure);
    };

    this.setMinDateValue = function () {
      if ($scope.viewEditItem) {
        $scope.surveyCatalog.startDate = $scope.viewStartDate;
        $scope.surveyCatalog.endDate = $scope.viewEndDate;
      }

    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        var saveFunctionName = ($routeParams.action + 'SurveyCatalog');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
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

    this.deSerializeSurveys = function(surveyList) {
      $scope.surveyItemList = [];

      angular.forEach(surveyList, function (item, index) {
        var newItem = {
          id: item.id,
          surveyId: item.surveyId,
          surveyIndex: index,
          selectedItem: item,
          sortOrder: item.orderBy
        };
        $scope.surveyItemList.push(newItem);
      });

      $scope.surveyItemList = $filter('orderBy')($scope.surveyItemList, 'sortOrder');
    };

    $scope.dropSuccess = function ($event, index, array) {
      if (draggedOntoIemIndex !== null && draggedSurveyItemObject !== null)
      {
        var tempItemObject = array[draggedOntoIemIndex];
        array.splice(draggedOntoIemIndex, 1, draggedSurveyItemObject);
        array.splice(index, 1, tempItemObject);
        draggedSurveyItemObject = null;
        for (var i = 0; i < array.length; i++)
        {
          array[i].sortOrderIndex = i;
          array[i].sortOrder = i;
        }
      } else {
        draggedSurveyItemObject = null;
        draggedOntoIemIndex = null;
        messageService.display('warning', 'Please drag and drop only inside the Add Survey list', 'Drag to reorder');
      }
    };

    $scope.onDrop = function ($event, $data, index) {
      draggedOntoIemIndex = index;
      draggedSurveyItemObject = $data;
    };

    this.getSurveyCatalogSuccess = function(response) {
      $scope.viewStartDate = dateUtility.formatDateForApp(response.startDate);
      $scope.viewEndDate = dateUtility.formatDateForApp(response.endDate);

      $scope.disablePastDate = dateUtility.isTodayOrEarlierDatePicker($scope.viewStartDate);
      $scope.shouldDisableEndDate = dateUtility.isYesterdayOrEarlierDatePicker($scope.viewEndDate);

      $scope.surveyCatalog = {
        id: response.id,
        catalogName: response.catalogName,
        startDate: $scope.viewStartDate,
        endDate: $scope.viewEndDate,
        surveys: $this.deSerializeSurveys(response.surveys)
      };

      $this.setMinDateValue();

      $this.hideLoadingModal();
    };

    this.initDependencies = function() {
      $this.showLoadingModal('Loading Data');

      var initFunctionName = ($routeParams.action + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

      $scope.minDate = dateUtility.nowFormattedDatePicker();

      if ($routeParams.id && $scope.viewEditItem) {
        surveyCatalogFactory.getSurveyCatalog($routeParams.id).then($this.getSurveyCatalogSuccess);
      } else {
        $this.hideLoadingModal();
      }
    };

    this.init = function() {
      $this.initDependencies();
    };

    this.init();
  });
