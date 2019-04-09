'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataCtrl', function($scope, postTripFactory, $location, $routeParams, messageService, dateUtility, lodash, 
      $q) {

    var companyId;
    var $this = this;

    $scope.viewName = 'Post Trip Data';
    $scope.readOnly = false;
    $scope.selectedEmployees = {};
    $scope.stationList = [];
    $scope.postTrip = {
      scheduleNumber: null
    };

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.createInit = function() {
      if ($routeParams.newTripId) {
        $location.path('post-trip-data/create').search({ newTripId: null });
      }

      $scope.readOnly = false;
      $scope.viewName = 'Create Post Trip Data';
    };

    this.viewInit = function() {
      $scope.readOnly = true;
      $scope.viewName = 'View Post Trip Data';
    };

    this.editInit = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Post Trip Data';
    };

    this.getPostTripSuccess = function(response) {
      $scope.postTrip = response;
      $scope.postTrip.passengerCount = $scope.postTrip.passengerCount.toString();
      $this.populateSelectedEmployeesFromPostTrip();
    };

    this.getStationsSuccess = function(response) {
      // TODO: move offset to service layer
      var newStationList = $scope.stationList.concat(angular.copy(response.response));
      $scope.stationList = lodash.uniq(newStationList, 'stationId');

      if (response.meta.start === 0 && response.meta.limit < response.meta.count) {
        postTripFactory.getStationList(companyId, response.meta.limit).then($this.getStationsSuccess);
      }
    };

    this.searchEmployeesSuccess = function(response) {
      if ($scope.selectedEmployees.employeeIds) {
        $scope.employees = lodash.filter(response.companyEmployees, function (employee) {
          return !lodash.find($scope.selectedEmployees.employeeIds, { id: employee.id });
        });
      } else {
        $scope.employees = response.companyEmployees;
      }
    };

    $scope.searchEmployees = function($select, $event) {
      if ($event) {
        $event.stopPropagation();
        $event.preventDefault();
      }

      if ($select.search && $select.search.length > 1) {
        var payload = {
          search: $select.search,
          date: dateUtility.formatDateForAPI($scope.postTrip.scheduleDate === undefined ? dateUtility.nowFormattedDatePicker() : $scope.postTrip.scheduleDate)
        };

        postTripFactory.getEmployees(companyId, payload).then($this.searchEmployeesSuccess);
      } else {
        $scope.employees = [];
      }
    };

    this.getSchedulesSuccess = function(response) {
      $scope.schedules = response.distinctSchedules;
      $scope.slicedSchedules = sliceScheduleNumbers($scope.schedules);
    };

    this.getCarrierSuccess = function(response) {
      $scope.carrierNumbers = angular.copy(response.response);
    };

    function sliceScheduleNumbers(schedules) {
      return lodash.map(schedules, function(schedule) {
        return schedule.scheduleNumber;
      });
    }

    $scope.getScheduleNumbers = function(search) {
      if (search && $scope.slicedSchedules.indexOf(search) === -1) {
        $scope.slicedSchedules.push(search);
      }

      return $scope.slicedSchedules;
    };

    this.saveFormSuccess = function(response) {
      $this.hideLoadingModal();
      if ($routeParams.state === 'create') {
        $location.path('post-trip-data-list').search({
          newTripId: response.id
        });
      } else {
        $this.showToastMessage('success', 'Edit Post Trip', 'success');
      }
    };

    this.saveFormFailure = function(dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.populateSelectedEmployeesFromPostTrip = function() {
      $scope.selectedEmployees.employeeIds = [];
      angular.forEach($scope.postTrip.postTripEmployeeIdentifiers, function(value) {
        $scope.selectedEmployees.employeeIds.push(value.companyEmployee);
        $scope.employees.push(value.companyEmployee);
      });
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.createPostTrip = function() {
      $this.checkForExistingPostTripThenCreateOrOverwrite();
    };

    this.checkForExistingPostTripThenCreateOrOverwrite = function() {
      $this.showLoadingModal('Saving Post Trip Data');
      postTripFactory.getPostTripDataList(companyId, {
          scheduleNumber: $scope.postTrip.scheduleNumber,
          scheduleStartDate: $scope.postTrip.scheduleDate,
          scheduleEndDate: $scope.postTrip.scheduleDate,
          depStationId: $scope.postTrip.depStationId,
          arrStationId: $scope.postTrip.arrStationId
        })
        .then($this.callCreateOrEditIfPostTripExists);
    };

    this.getStationById = function(stationId) {
      var stationCode = '';
      if (!stationId || $scope.stationList.length <= 0) {
        return '';
      }

      angular.forEach($scope.stationList, function(value) {
        if (value.stationId === stationId) {
          stationCode = value.stationCode;
        }
      });

      return stationCode;
    };

    this.callCreateOrEditIfPostTripExists = function(response) {
      if (response.postTrips.length > 0) {
        $scope.depStationCode = $this.getStationById(response.postTrips[0].depStationId);
        $scope.arrStationCode = $this.getStationById(response.postTrips[0].arrStationId);
        $this.hideLoadingModal();
        angular.element('#overwrite-modal').modal('show');
        $scope.overwritePostTripId = response.postTrips[0].id;
      } else {
        postTripFactory.createPostTrip(companyId, $scope.postTrip).then(
          $this.saveFormSuccess,
          $this.saveFormFailure
        );
      }
    };

    this.editPostTrip = function() {
      $this.showLoadingModal('Saving Post Trip Data');

      // TODO: temporary -- remove once API is fixed and can accept depTImeZone and arrTimeZone
      delete $scope.postTrip.depTimeZone;
      delete $scope.postTrip.arrTimeZone;
      var payload = angular.copy($scope.postTrip);
      postTripFactory.updatePostTrip(companyId, payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    $scope.overwritePostTrip = function() {
      $scope.postTrip.id = $scope.overwritePostTripId;
      $this.editPostTrip();
    };

    this.initDependenciesSuccess = function(responseArray) {
      $this.getStationsSuccess(responseArray[0]);
      $this.getCarrierSuccess(responseArray[1]);
      $this.getSchedulesSuccess(responseArray[2]);

      if ($routeParams.id) {
        postTripFactory.getPostTrip(companyId, $routeParams.id).then($this.getPostTripSuccess);
      }

      $this.hideLoadingModal();

      var initFunctionName = ($routeParams.state + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }
    };

    this.makeInitPromises = function() {
      companyId = postTripFactory.getCompanyId();
      var promises = [
        postTripFactory.getStationList(companyId),
        postTripFactory.getCarrierNumbers(companyId),
        postTripFactory.getSchedules(companyId)
      ];
      return promises;
    };

    this.init = function() {
      $this.showLoadingModal('Loading Data');
      $scope.employees = [];
      var initPromises = $this.makeInitPromises();
      $q.all(initPromises).then($this.initDependenciesSuccess);
    };

    this.init();

    $scope.$watchGroup(['postTrip', 'stationList'], function() {
      if ($scope.postTrip && $scope.stationList) {
        $scope.updateArrivalTimeZone();
        $scope.updateDepartureTimeZone();
        $this.hideLoadingModal();
      }
    });

    this.getTimeZoneForStationId = function(stationId) {
      var matchingStation = $scope.stationList.filter(function(station) {
        return station.stationId.toString() === stationId.toString();
      })[0];

      if (matchingStation && matchingStation.timezone !== null && matchingStation.utcOffset !==  null) {
        return matchingStation.timezone + ' [UTC ' + matchingStation.utcOffset + ']';
      }

      return '';
    };

    $scope.updateArrivalTimeZone = function() {
      if ($scope.postTrip === undefined || $scope.postTrip.arrStationId === undefined) {
        return;
      }

      $scope.arrivalTimezone = $this.getTimeZoneForStationId($scope.postTrip.arrStationId);
    };

    $scope.updateDepartureTimeZone = function() {
      if ($scope.postTrip === undefined || $scope.postTrip.depStationId === undefined) {
        return;
      }

      $scope.departureTimezone = $this.getTimeZoneForStationId($scope.postTrip.depStationId);
    };

    this.formatEmployeeIdentifiersForAPI = function() {
      $scope.postTrip.postTripEmployeeIdentifiers = [];
      angular.forEach($scope.selectedEmployees.employeeIds, function(value) {
        $scope.postTrip.postTripEmployeeIdentifiers.push({
          employeeId: value.id
        });
      });
    };

    this.validateEmployees = function() {
      var isSelectedEmployeesInvalid = ($scope.selectedEmployees.employeeIds === undefined || $scope.selectedEmployees.employeeIds.length <= 0);

      if (isSelectedEmployeesInvalid) {
        $scope.postTripDataForm.employeeIds.$setValidity('required', false);
        return;
      }

      $scope.postTripDataForm.employeeIds.$setValidity('required', true);
    };

    this.validateForm = function() {
      $this.validateEmployees();
      return $scope.postTripDataForm.$valid;
    };

    $scope.formSave = function() {
      if ($this.validateForm()) {
        $this.formatEmployeeIdentifiersForAPI();
        var saveFunctionName = ($routeParams.state + 'PostTrip');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      } else {
        $scope.displayError = true;
      }
    };

  });
