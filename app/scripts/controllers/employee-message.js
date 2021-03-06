'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:EmployeeMessageCtrl
 * @description
 * # EmployeeMessageCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('EmployeeMessageCtrl',
  function($scope, employeeMessagesFactory, globalMenuService, lodash, dateUtility, $q, $routeParams, $location, formValidationUtility) {
    var $this = this;
    $scope.validation = formValidationUtility;
    $scope.dataInitialized = false;
    $scope.viewEditItem = false;
    $scope.disablePastDate = false;

    this.showLoadingModal = function(text) {
      angular.element('#loading').modal('show').find('p').text(text);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.showErrors = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = dataFromAPI;
    };

    this.getAttributeByIdFromArray = function(id, attribute, array) {
      var objectMatch = lodash.findWhere(array, {
        id: id
      });
      if (objectMatch) {
        return objectMatch[attribute];
      }

      return '';
    };

    this.filterList = function(selectedList, masterList, optionalMatchCriteria) {
      var matchAttribute = optionalMatchCriteria || 'id';
      return lodash.filter(masterList, function(record) {
        var matchCriteria = {};
        matchCriteria[matchAttribute] = record[matchAttribute];
        var recordMatch = (lodash.findWhere(selectedList, matchCriteria));
        return !recordMatch;
      });
    };

    this.filterListsByName = function(listName) {
      var listsToFilter = (listName === 'all') ? ['employees', 'schedules', 'departureStations', 'arrivalStations'] : [
        listName
      ];
      angular.forEach(listsToFilter, function(list) {
        var scopeArrayName = (list === 'departureStations' || list === 'arrivalStations') ? 'stationsList' : (
          list + 'List');
        var optionalMatchCriteria = (list === 'schedules') ? 'scheduleNumber' : null;
        var filteredArrayName = 'filtered' + lodash.capitalize(list);

        $scope[filteredArrayName] = $this.filterList($scope.employeeMessage[list], $scope[scopeArrayName],
          optionalMatchCriteria);
      });
    };

    this.formatArrayForAPIWithAttributes = function(array, attributeToSave) {
      var newArray = [];
      angular.forEach(array, function(record) {
        var newRecord = {};
        newRecord[attributeToSave] = record[attributeToSave];
        if (record.recordId) {
          newRecord.id = record.recordId;
        }

        newArray.push(newRecord);
      });

      return newArray;
    };

    this.formatStationsArrayForAPI = function(stationsArray) {
      var newStationsArray = [];
      angular.forEach(stationsArray, function(station) {
        newStationsArray.push(station.id);
      });

      return newStationsArray;
    };

    this.formatEmployeeMessageEmployeeIdentifiersPayload = function() {
      var newArray = [];
      angular.forEach($scope.employeeMessage.employeeMessageEmployeeIdentifiers, function(record) {
        var newRecord = {
          employeeIdentifier: record.employeeIdentifier,
          companyEmployeeId: record.companyEmployeeId
        };

        newArray.push(newRecord);
      });

      return newArray;
    };

    this.formatPayload = function() {
      var formData = angular.copy($scope.employeeMessage);
      var payload = {};
      payload.employeeMessageText = formData.employeeMessageText;
      payload.startDate = dateUtility.formatDateForAPI(formData.startDate);
      payload.endDate = dateUtility.formatDateForAPI(formData.endDate);
      payload.employeeMessageArrivalStations = $this.formatStationsArrayForAPI(formData.arrivalStations);
      payload.employeeMessageDepartureStations = $this.formatStationsArrayForAPI(formData.departureStations);
      payload.employeeMessageSchedules = $this.formatArrayForAPIWithAttributes(formData.schedules, 'scheduleNumber');
      payload.employeeMessageEmployeeIdentifiers = $this.formatEmployeeMessageEmployeeIdentifiersPayload();

      return {
        employeeMessage: payload
      };
    };

    $this.saveSuccess = function() {
      $this.hideLoadingModal();
      $location.path('employee-messages');
    };

    $this.isEffectiveDateRangeValid = function() {
      if ($scope.employeeMessage.startDate && $scope.employeeMessage.endDate) {
        if (dateUtility.diff($scope.employeeMessage.startDate, $scope.employeeMessage.endDate) < 0) {
          var errorData = {
            data: [
              {
                field: 'Effective To',
                code: '021'
              }
            ]
          };
          $scope.errorResponse = angular.copy(errorData);
          $scope.displayError = true;

          return false;
        }

        return true;
      }

      return true;
    };

    $scope.save = function() {
      $scope.employeeMessageForm.$setSubmitted(true);

      if (!$this.isEffectiveDateRangeValid()) {
        return;
      }

      var payload = $this.formatPayload();
      $this.showLoadingModal('Saving data...');
      if ($routeParams.action === 'edit') {
        employeeMessagesFactory.editEmployeeMessage($routeParams.id, payload).then($this.saveSuccess, $this.showErrors);
      } else {
        employeeMessagesFactory.createEmployeeMessage(payload).then($this.saveSuccess, $this.showErrors);
      }
    };

    $scope.shouldDisable = function(isFieldDisabledInActiveRecord) {
      if (isFieldDisabledInActiveRecord) {
        return $scope.readOnly || $scope.shouldDisableActiveFields();
      }

      return $scope.readOnly;
    };

    $scope.shouldDisableActiveFields = function() {
      if (!$scope.dataInitialized) {
        return false;
      }

      if (!$scope.employeeMessage) {
        return true;
      }

      var isRecordActive = dateUtility.isTodayOrEarlierDatePicker($scope.employeeMessage.startDate);
      return ($routeParams.action === 'edit' && isRecordActive);
    };

    $scope.shouldDisableEndDate = function() {
      if (!$scope.dataInitialized) {
        return false;
      }

      if (!$scope.employeeMessage) {
        return true;
      }

      var shouldDisable = dateUtility.isYesterdayOrEarlierDatePicker($scope.employeeMessage.endDate);
      return ($routeParams.action === 'edit' && shouldDisable);
    };

    $scope.getPropertiesForDeletedButton = function(listName, attribute) {
      var canDelete = false;
      if ($scope.employeeMessage) {
        angular.forEach($scope.employeeMessage[listName], function(record) {
          canDelete = canDelete || record.selectedToDelete;
        });
      }

      var properties = (canDelete) ? {
        disabled: false,
        button: 'btn btn-xs btn-danger'
      } : {
        disabled: true,
        button: 'btn btn-xs btn-default'
      };
      return properties[attribute];
    };

    $scope.getPropertiesForDeletedButtonEmployeeIdentifiers = function(attribute) {
      var canDelete = false;
      if ($scope.employeeMessage) {
        angular.forEach($scope.employeeMessage.employeeMessageEmployeeIdentifiers, function(record) {
          canDelete = canDelete || record.selectedToDelete;
        });
      }

      var properties = (canDelete) ? {
          disabled: false,
          button: 'btn btn-xs btn-danger'
        } : {
          disabled: true,
          button: 'btn btn-xs btn-default'
        };
      return properties[attribute];
    };

    $scope.toggleSelectAll = function(toggleFlag, listName) {
      angular.forEach($scope.employeeMessage[listName], function(record) {
        record.selectedToDelete = toggleFlag;
      });
    };

    $scope.toggleSelectAllEmployeeIdentifiers = function() {
      angular.forEach($scope.employeeMessage.employeeMessageEmployeeIdentifiers, function(record) {
        record.selectedToDelete = $scope.employeesDeleteAll;
      });
    };

    $scope.removeItems = function(listName) {
      $scope.employeeMessage[listName] = lodash.filter($scope.employeeMessage[listName], function(record) {
        return !record.selectedToDelete;
      });

      $scope[listName + 'DeleteAll'] = false;
      $this.filterListsByName(listName);
    };

    $scope.removeSelectedEmployeeIdentifiers = function() {
      $scope.employeeMessage.employeeMessageEmployeeIdentifiers = lodash.filter($scope.employeeMessage.employeeMessageEmployeeIdentifiers, function(record) {
        return !record.selectedToDelete;
      });
    };

    this.addNewRecordsToArrayWithAttributes = function(existingArray, newArray, attributesToSave) {
      angular.forEach(newArray, function(record) {
        var newRecord = {};
        angular.forEach(attributesToSave, function(attribute) {
          newRecord[attribute] = record[attribute];
        });

        existingArray.push(newRecord);
      });
    };

    $scope.addNewItem = function(categoryName) {
      var categoryToAttributesMap = {
        schedules: ['scheduleNumber'],
        arrivalStations: ['code', 'name', 'id'],
        departureStations: ['code', 'name', 'id']
      };

      $this.addNewRecordsToArrayWithAttributes($scope.employeeMessage[categoryName], $scope.newRecords[categoryName],
        categoryToAttributesMap[categoryName]);
      $scope.newRecords[categoryName] = [];
      $scope[categoryName + 'AddAll'] = false;
      $this.filterListsByName(categoryName);
    };

    $scope.addNewEmployee = function() {
      angular.forEach($scope.newRecords.employees, function(newEmployee) {
        var existingEmployeeIdByIdentifier = lodash.filter($scope.employeeMessage.employeeMessageEmployeeIdentifiers, function (emi) {
          return emi.employeeIdentifier === newEmployee.employeeIdentifier;
        });

        if (existingEmployeeIdByIdentifier.length === 0) {
          var newMessageIdentifier = {
            employeeIdentifier: newEmployee.employeeIdentifier,
            employeeFirstName: newEmployee.firstName,
            employeeLastName: newEmployee.lastName,
            companyEmployeeId: newEmployee.id
          };

          $scope.employeeMessage.employeeMessageEmployeeIdentifiers.push(newMessageIdentifier);
        }
      });
    };

    this.createNewRecordWithMatchingAttributes = function(record, arrayToCheck, attributeToMatch,
      attributesToSaveArray) {
      var matchCriteria = {};
      matchCriteria[attributeToMatch] = record[attributeToMatch];
      var recordMatch = lodash.findWhere(arrayToCheck, matchCriteria);
      if (recordMatch) {
        var newRecord = {
          recordId: record.id,
          id: recordMatch.id
        };
        angular.forEach(attributesToSaveArray, function(attribute) {
          newRecord[attribute] = recordMatch[attribute];
        });

        return newRecord;
      }

      return {};
    };

    this.reformatEmployeeMessageArray = function(arrayToReformat, arrayToCheck, attributeToMatch,
      attributesToSaveArray) {
      var newArray = [];
      angular.forEach(arrayToReformat, function(record) {
        var newRecord = $this.createNewRecordWithMatchingAttributes(record, arrayToCheck, attributeToMatch,
          attributesToSaveArray);
        newArray.push(newRecord);
      });

      return newArray;
    };

    this.reformatEmployeeMessageStation = function(arrayToReformat) {
      var stationArray = [];
      angular.forEach(arrayToReformat, function(stationId) {
        var stationCode = $this.getAttributeByIdFromArray(stationId, 'code', $scope.stationsList);
        var stationName = $this.getAttributeByIdFromArray(stationId, 'name', $scope.stationsList);
        stationArray.push({
          id: stationId,
          code: stationCode,
          name: stationName
        });
      });

      return stationArray;
    };

    this.formatEmployeeMessageForApp = function(dataFromAPI) {
      var employeeMessage = angular.copy(dataFromAPI.employeeMessage);
      employeeMessage.startDate = dateUtility.formatDateForApp(employeeMessage.startDate);
      employeeMessage.endDate = dateUtility.formatDateForApp(employeeMessage.endDate);

      employeeMessage.arrivalStations = $this.reformatEmployeeMessageStation(employeeMessage.employeeMessageArrivalStations);
      employeeMessage.departureStations = $this.reformatEmployeeMessageStation(employeeMessage.employeeMessageDepartureStations);
      employeeMessage.employees = $this.reformatEmployeeMessageArray(employeeMessage.employeeMessageEmployeeIdentifiers,
        $scope.employeesList, 'employeeIdentifier', ['employeeIdentifier', 'firstName', 'lastName']);
      employeeMessage.schedules = $this.reformatEmployeeMessageArray(employeeMessage.employeeMessageSchedules,
        $scope.schedulesList, 'scheduleNumber', ['scheduleNumber']);

      return employeeMessage;
    };

    this.getEmployeeMessageSuccess = function(dataFromAPI) {
      $scope.employeeMessage = $this.formatEmployeeMessageForApp(dataFromAPI);

      $scope.disablePastDate = dateUtility.isTodayDatePicker($scope.employeeMessage.startDate) || !(dateUtility.isAfterTodayDatePicker($scope.employeeMessage.startDate));
      var isRecordActiveOrFuture = dateUtility.isTodayDatePicker($scope.employeeMessage.endDate) || dateUtility.isAfterTodayDatePicker($scope.employeeMessage.endDate);

      if (isRecordActiveOrFuture) {
        $this.filterListsByName('all');
      } else {
        $scope.readOnly = true;
      }

      $scope.dataInitialized = true;

      $this.hideLoadingModal();
    };

    this.getEmployeeMessage = function() {
      $this.showLoadingModal('Loading Employee Message');
      return employeeMessagesFactory.getEmployeeMessage($routeParams.id).then($this.getEmployeeMessageSuccess,
        $this.showErrors);
    };

    this.getSchedules = function() {
      var companyId = globalMenuService.company.get();
      return employeeMessagesFactory.getSchedules(companyId).then(function(dataFromAPI) {
        $scope.schedulesList = angular.copy(dataFromAPI.distinctSchedules);
      }, $this.showErrors);
    };

    this.getStations = function() {
      return employeeMessagesFactory.getStations().then(function(dataFromAPI) {
        $scope.stationsList = angular.copy(dataFromAPI.response);
      }, $this.showErrors);
    };

    this.getEmployees = function() {
      var companyId = globalMenuService.company.get();
      return employeeMessagesFactory.getEmployees(companyId).then(function(dataFromAPI) {
        $scope.employeesList = angular.copy(dataFromAPI.companyEmployees);
      }, $this.showErrors);
    };

    this.searchEmployeesSuccess = function(response) {
      if ($scope.multiSelectedValues.employeeIds) {
        $scope.employeesList = lodash.filter(response.companyEmployees, function (employee) {
          return !lodash.find($scope.multiSelectedValues.employeeIds, { id: employee.id });
        });
      } else {
        $scope.employeesList = response.companyEmployees;
      }
    };

    $scope.searchEmployees = function($select, $event) {
      if ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      if ($select.search && $select.search.length !== 0) {
        var payload = {
          search: $select.search
        };

        console.log($scope);
        employeeDates(payload, $scope.employeeMessage);
        var companyId = globalMenuService.company.get();
        employeeMessagesFactory.getEmployees(companyId, payload).then($this.searchEmployeesSuccess);
      } else {
        $scope.employees = [];
      }
    };

    // jshint maxcomplexity:6
    function employeeDates(payload, search) {
      if (search === undefined || (search.startDate === undefined && search.endDate === undefined)) {
        payload.date = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      } else if (search.startDate === undefined || search.endDate === undefined) {
        payload.date = dateUtility.formatDateForAPI(search.startDate === undefined ? search.endDate : search.startDate);
      } else {
        payload.startDate =  dateUtility.formatDateForAPI(search.startDate);
        payload.endDate =  dateUtility.formatDateForAPI(search.endDate);
      }
    }

    $scope.$watchGroup(['employeeMessage.startDate', 'employeeMessage.endDate'], function () {
      if ($scope.employeeMessage && $scope.employeeMessage.startDate && $scope.employeeMessage.endDate) {
        $this.clearInactiveEmployees();
        $scope.employeesList = [];
      }
    });

    this.clearInactiveEmployees = function () {
      $scope.employeeMessage.employees = lodash.filter($scope.employeeMessage.employees, function (employee) {
        return $this.isEmployeeActiveInRange(employee, $scope.employeeMessage.startDate, $scope.employeeMessage.endDate);
      });
    };

    this.isEmployeeActiveInRange = function(employee, startDate, endDate) {
      return dateUtility.isBeforeOrEqual(dateUtility.formatDateForApp(employee.startDate), endDate) &&
        dateUtility.isAfterOrEqual(dateUtility.formatDateForApp(employee.endDate), startDate);
    };

    this.initEmployeeMessage = function() {
      if ($routeParams.action !== 'create') {
        $this.getEmployeeMessage();
      } else {
        $scope.dataInitialized = true;
        $scope.employeeMessage = {
          employees: [],
          schedules: [],
          arrivalStations: [],
          departureStations: [],
          employeeMessageEmployeeIdentifiers: []
        };
        $this.hideLoadingModal();
        $this.filterListsByName('all');
      }
    };

    this.initApiDependencies = function() {
      return [
        $this.getSchedules(),
        $this.getStations()
      ];
    };

    this.initScopeDependencies = function() {
      $scope.readOnly = $routeParams.action === 'view';
      $scope.newRecords = {};
      $scope.selectedEmployees = {};
      $scope.selectedEmployees.employeeIds = [];
      $scope.multiSelectedValues = {};

      var actionToViewNameMap = {
        view: 'View Employee Message ' + $routeParams.id,
        edit: 'Edit Employee Message ' + $routeParams.id,
        create: 'Create New Employee Message'
      };
      $scope.viewName = actionToViewNameMap[$routeParams.action];

      if ($routeParams.action === 'view') {
        $scope.viewEditItem = true;
      } else if ($routeParams.action === 'edit') {
        $scope.viewEditItem = true;
      } else {
        $scope.viewEditItem = false;
      }
    };

    this.init = function() {
      $this.showLoadingModal('Loading page dependencies');
      $this.initScopeDependencies();
      var initPromises = $this.initApiDependencies();
      $q.all(initPromises).then(function() {
        $this.initEmployeeMessage();
      });

      $scope.minDate = dateUtility.nowFormattedDatePicker();
    };

    this.init();

    $scope.isCurrentEffectiveDate = function (date) {
      return dateUtility.isAfterTodayDatePicker(date.endDate) || dateUtility.isTodayDatePicker(date.endDate);
    };

  });
