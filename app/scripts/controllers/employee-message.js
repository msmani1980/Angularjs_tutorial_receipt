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
            lodash, dateUtility, $q, $routeParams, $location) {

    var $this = this;
    var companyId = GlobalMenuService.company.get();

    this.showLoadingModal = function (text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.showErrors = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    this.getAttributeByIdFromArray = function (id, attribute, array) {
      var objectMatch = lodash.findWhere(array, {id: id});
      if (objectMatch) {
        return objectMatch[attribute];
      }
      return '';
    };

    this.filterList = function (selectedList, masterList, optionalMatchCriteria) {
      var matchAttribute = optionalMatchCriteria || 'id';
      return lodash.filter(masterList, function (record) {
        var matchCriteria = {};
        matchCriteria[matchAttribute] = record[matchAttribute];
        var recordMatch = (lodash.findWhere(selectedList, matchCriteria));
        return !recordMatch;
      });
    };

    this.filterListsByName = function (listName) {
      if (listName === 'employees' || listName === 'all') {
        $scope.filteredEmployees = $this.filterList($scope.employeeMessage.employees, $scope.employeesList);
      }
      if (listName === 'schedules' || listName === 'all') {
        $scope.filteredSchedules = $this.filterList($scope.employeeMessage.schedules, $scope.schedulesList, 'scheduleNumber');
      }
      if (listName === 'departureStations' || listName === 'all') {
        $scope.filteredDepStations = $this.filterList($scope.employeeMessage.departureStations, $scope.stationsList);
      }
      if (listName === 'arrivalStations' || listName === 'all') {
        $scope.filteredArrStations = $this.filterList($scope.employeeMessage.arrivalStations, $scope.stationsList);
      }
    };

    this.formatArrayForAPIWithAttributes = function (array, attributeToSave) {
      var newArray = [];
      angular.forEach(array, function(record) {
        var newRecord = {};
        newRecord[attributeToSave] = record[attributeToSave];
        if(record.recordId) {
          newRecord.id = record.recordId;
        }
        newArray.push(newRecord);
      });
      return newArray;
    };

    this.formatStationsArrayForAPI = function (stationsArray) {
      var newStationsArray = [];
      angular.forEach(stationsArray, function(station) {
        newStationsArray.push(station.id);
      });
      return newStationsArray;
    };

    this.formatPayload = function () {
      var formData = angular.copy($scope.employeeMessage);
      var payload = {};
      payload.employeeMessageText = formData.employeeMessageText;
      payload.startDate = dateUtility.formatDateForAPI(formData.startDate);
      payload.endDate = dateUtility.formatDateForAPI(formData.endDate);
      payload.employeeMessageArrivalStations =  $this.formatStationsArrayForAPI(formData.arrivalStations);
      payload.employeeMessageDepartureStations = $this.formatStationsArrayForAPI(formData.departureStations);
      payload.employeeMessageSchedules = $this.formatArrayForAPIWithAttributes(formData.schedules, 'scheduleNumber');
      payload.employeeMessageEmployeeIdentifiers = $this.formatArrayForAPIWithAttributes(formData.employees, 'employeeIdentifier');

      return {employeeMessage: payload};
    };

    $this.saveSuccess = function () {
      $this.hideLoadingModal();
      $location.path('employee-messages').search();
    };

    $scope.save = function () {
      var payload = $this.formatPayload();
      $this.showLoadingModal('Saving data...');
      if($routeParams.action === 'edit') {
        employeeMessagesFactory.editEmployeeMessage($routeParams.id, payload).then($this.saveSuccess, $this.showErrors);
      } else {
        employeeMessagesFactory.createEmployeeMessage(payload).then($this.saveSuccess, $this.showErrors);
      }
    };


    $scope.getPropertiesForDeletedButton = function (listName, attribute) {
      var canDelete = false;
      if ($scope.employeeMessage) {
        angular.forEach($scope.employeeMessage[listName], function (record) {
          canDelete = canDelete || record.selectedToDelete;
        });
      }

      var properties = (canDelete) ? {disabled: false, button: 'btn btn-xs btn-danger'} : {
        disabled: true,
        button: 'btn btn-xs btn-default'
      };
      return properties[attribute];
    };

    $scope.selectAllToAdd = function (toggleFlag, listName) {
      var listNameToFilteredListMap = {
        schedules: $scope.filteredSchedules,
        employees: $scope.filteredEmployees,
        arrivalStations: $scope.filteredArrStations,
        departureStations: $scope.filteredDepStations
      };

      $scope.newRecords[listName] = [];
      if (toggleFlag) {
        angular.forEach(listNameToFilteredListMap[listName], function (record) {
          $scope.newRecords[listName].push(record);
        });
      }
    };

    $scope.toggleSelectAll = function (toggleFlag, listName) {
      angular.forEach($scope.employeeMessage[listName], function (record) {
        record.selectedToDelete = toggleFlag;
      });
    };

    $scope.removeItems = function (listName) {
      $scope.employeeMessage[listName] = lodash.filter($scope.employeeMessage[listName], function (record) {
        return !record.selectedToDelete;
      });
      $scope[listName + 'DeleteAll'] = false;
      $this.filterListsByName(listName);
    };


    this.addNewRecordsToArrayWithAttributes = function (existingArray, newArray, attributesToSave) {
      angular.forEach(newArray, function (record) {
        var newRecord = {};
        angular.forEach(attributesToSave, function (attribute) {
          newRecord[attribute] = record[attribute];
        });
        existingArray.push(newRecord);
      });
    };

    $scope.addNewItem = function (categoryName) {
      var categoryToAttributesMap = {
        schedules: ['scheduleNumber'],
        employees: ['employeeIdentifier', 'firstName', 'lastName', 'id'],
        arrivalStations: ['code', 'name', 'id'],
        departureStations: ['code', 'name', 'id']
      };

      $this.addNewRecordsToArrayWithAttributes($scope.employeeMessage[categoryName], $scope.newRecords[categoryName], categoryToAttributesMap[categoryName]);
      $scope.newRecords[categoryName] = [];
      $scope[categoryName + 'AddAll'] = false;
      $this.filterListsByName(categoryName);
    };

    this.createNewRecordWithMatchingAttributes = function (record, arrayToCheck, attributeToMatch, attributesToSaveArray) {
      var matchCriteria = {};
      matchCriteria[attributeToMatch] = record[attributeToMatch];
      var recordMatch = lodash.findWhere(arrayToCheck, matchCriteria);
      var newRecord = {recordId: record.id, id: recordMatch.id};
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
        stationArray.push({id: stationId, code: stationCode, name: stationName});
      });
      return stationArray;
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
      $this.filterListsByName('all');
      $this.hideLoadingModal();
    };

    this.getEmployeeMessage = function () {
      $this.showLoadingModal('Loading Employee Message');
      return employeeMessagesFactory.getEmployeeMessage($routeParams.id).then($this.getEmployeeMessageSuccess, $this.showErrors);
    };

    this.getSchedules = function () {
      return employeeMessagesFactory.getSchedules(companyId).then(function (dataFromAPI) {
        $scope.schedulesList = angular.copy(dataFromAPI.distinctSchedules);
      }, $this.showErrors);
    };

    this.getStations = function () {
      return employeeMessagesFactory.getStations().then(function (dataFromAPI) {
        $scope.stationsList = angular.copy(dataFromAPI.response);
      }, $this.showErrors);
    };

    this.getEmployees = function () {
      return employeeMessagesFactory.getEmployees(companyId).then(function (dataFromAPI) {
        $scope.employeesList = angular.copy(dataFromAPI.companyEmployees);
      }, $this.showErrors);
    };

    this.initEmployeeMessage = function () {
      if ($routeParams.action !== 'create') {
        $this.getEmployeeMessage();
      } else {
        $scope.employeeMessage = {employees: [], schedules: [], arrivalStations: [], departureStations: []};
        $this.hideLoadingModal();
        $this.filterListsByName('all');
      }
    };

    this.initApiDependencies = function () {
      return [
        $this.getSchedules(),
        $this.getStations(),
        $this.getEmployees()
      ];
    };

    this.initScopeDependencies = function () {
      $scope.readOnly = $routeParams.action === 'view';
      $scope.newRecords = {};

      var actionToViewNameMap = {
        view: 'View Employee Message ' + $routeParams.id,
        edit: 'Edit Employee Message ' + $routeParams.id,
        create: 'Create New Employee Message'
      };
      $scope.viewName = actionToViewNameMap[$routeParams.action];
    };

    this.init = function () {
      $this.showLoadingModal('Loading page dependencies');
      $this.initScopeDependencies();
      var initPromises = $this.initApiDependencies();
      $q.all(initPromises).then(function () {
        $this.initEmployeeMessage();
      });
    };
    this.init();

  });
