'use strict';

/* global moment */
/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeMessageCtrl
 * @description
 * # EmployeeMessageCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeMessageCtrl',
  function ($scope, employeeMessagesFactory, GlobalMenuService,
            lodash, dateUtility, $q, $routeParams) {

    var $this = this;
    var companyId = GlobalMenuService.company.get();
    $scope.viewName = 'Employee Message';

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.getAttributeByIdFromArray = function (id, attribute, array) {
      var objectMatch = lodash.findWhere(array, {id: id});
      if (objectMatch) {
        return objectMatch[attribute];
      }
      return '';
    };

    this.filterList = function (selectedList, masterList, optionalMatchCriteria) {
      var searchAttribute = optionalMatchCriteria || 'recordId';
      var recordAttribute = optionalMatchCriteria || 'id';

      var filteredList = lodash.filter(masterList, function (record) {
        var matchCriteria = {};
        matchCriteria[searchAttribute] = record[recordAttribute];
        var recordMatch = (lodash.findWhere(selectedList, matchCriteria));
        return !recordMatch;
      });
      return filteredList;
    };

    this.createNewRecordWithMatchingAttributes = function (record, arrayToCheck, attributeToMatch, attributesToSaveArray) {
      var matchCriteria = {};
      matchCriteria[attributeToMatch] = record[attributeToMatch];
      var recordMatch = lodash.findWhere(arrayToCheck, matchCriteria);
      var newRecord = {id: record.id, recordId: recordMatch.id};
      angular.forEach(attributesToSaveArray, function (attribute) {
        newRecord[attribute] = recordMatch[attribute];
      });
      return newRecord;
    };

    this.reformatEmployeeMessageArray = function (arrayToReformat, arrayToCheck, attributeToMatch, attributesToSaveArray) {
      var newArray = [];
      angular.forEach(arrayToReformat, function (record) {
        var newRecord = $this.createNewRecordWithMatchingAttributes(record, arrayToCheck, attributeToMatch, attributesToSaveArray);
        newArray.push(newRecord);
      });
      return newArray;
    };

    this.reformatEmployeeMessageStation = function (arrayToReformat) {
      var stationArray = [];
      angular.forEach(arrayToReformat, function (stationId) {
        var stationCode = $this.getAttributeByIdFromArray(stationId, 'code', $scope.stationsList);
        var stationName = $this.getAttributeByIdFromArray(stationId, 'name', $scope.stationsList);
        stationArray.push({recordId: stationId, code: stationCode, name: stationName});
      });
      return stationArray;
    };

    this.initializeAllFilteredLists = function () {
      $scope.filteredEmployees = $this.filterList($scope.employeeMessage.employees, $scope.employeesList);
      $scope.filteredSchedules = $this.filterList($scope.employeeMessage.schedules, $scope.schedulesList, 'scheduleNumber');
      $scope.filteredDepStations = $this.filterList($scope.employeeMessage.departureStations, $scope.stationsList);
      $scope.filteredArrStations = $this.filterList($scope.employeeMessage.arrivalStations, $scope.stationsList);
    };

    this.formatEmployeeMessageForApp = function (dataFromAPI) {
      var employeeMessage = angular.copy(dataFromAPI.employeeMessage);
      employeeMessage.startDate = dateUtility.formatDateForApp(employeeMessage.startDate);
      employeeMessage.endDate = dateUtility.formatDateForApp(employeeMessage.endDate);

      employeeMessage.arrivalStations = $this.reformatEmployeeMessageStation(employeeMessage.employeeMessageArrivalStations);
      employeeMessage.departureStations = $this.reformatEmployeeMessageStation(employeeMessage.employeeMessageDepartureStations);
      employeeMessage.employees = $this.reformatEmployeeMessageArray(employeeMessage.employeeMessageEmployeeIdentifiers, $scope.employeesList, 'employeeIdentifier', ['employeeIdentifier', 'firstName', 'lastName']);
      employeeMessage.schedules = $this.reformatEmployeeMessageArray(employeeMessage.employeeMessageSchedules, $scope.schedulesList, 'scheduleNumber', ['scheduleNumber']);

      $scope.employeeMessage = employeeMessage;
    };

    this.getEmployeeMessageSuccess = function (dataFromAPI) {
      $this.formatEmployeeMessageForApp(dataFromAPI);
      $this.initializeAllFilteredLists();
      $this.hideLoadingModal();
    };

    this.getEmployeeMessage = function () {
      $this.showLoadingModal('Loading Employee Message');
      return employeeMessagesFactory.getEmployeeMessage($routeParams.id).then($this.getEmployeeMessageSuccess);
    };

    this.getSchedules = function () {
      return employeeMessagesFactory.getSchedules(companyId).then(function (dataFromAPI) {
        $scope.schedulesList = angular.copy(dataFromAPI.distinctSchedules);
      });
    };

    this.getStations = function () {
      return employeeMessagesFactory.getStations().then(function (dataFromAPI) {
        $scope.stationsList = angular.copy(dataFromAPI.response);
      });
    };

    this.getEmployees = function () {
      return employeeMessagesFactory.getEmployees(companyId).then(function (dataFromAPI) {
        $scope.employeesList = angular.copy(dataFromAPI.companyEmployees);
      });
    };

    this.initEmployeeMessage = function () {
      if ($routeParams.action !== 'create') {
        $this.getEmployeeMessage();
      } else {
        $scope.employeeMessage = {employees: [], schedules: [], arrivalStations: [], departureStations: []};
        $this.hideLoadingModal();
        $this.initializeAllFilteredLists();
      }
    };

    this.initDependencies = function () {
      return [
        $this.getSchedules(),
        $this.getStations(),
        $this.getEmployees()
      ];
    };

    this.init = function () {
      $this.showLoadingModal('Loading page dependencies');
      $scope.readOnly = $routeParams.action === 'view';
      var initPromises = $this.initDependencies();
      $q.all(initPromises).then(function () {
        $this.initEmployeeMessage();
      });
    };
    this.init();

  });
