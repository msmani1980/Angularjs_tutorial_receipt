'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataCtrl', function ($scope, postTripFactory, $location, $routeParams, ngToast) {

    var companyId;
    var $this = this;

    $scope.viewName = 'Post Trip Data';
    $scope.readOnly = false;
    $scope.selectedEmployees = {};
    $scope.stationList = [];

    this.showLoadingModal = function (message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function () {
      angular.element('#loading').modal('hide');
    };

    this.createInit = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Create Post Trip Data';
    };

    this.viewInit = function () {
      $scope.readOnly = true;
      $scope.viewName = 'View Post Trip Data';
    };

    this.editInit = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Post Trip Data';
    };

    this.getPostTripSuccess = function (response) {
      $scope.postTrip = response;
      $scope.postTrip.passengerCount = $scope.postTrip.passengerCount.toString();
      $this.populateSelectedEmployeesFromPostTrip();
    };

    this.getStationsSuccess = function (response) {
      // TODO: move offset to service layer
      var newStationList = $scope.stationList.concat(response.response);
      $scope.stationList = newStationList;

      if(response.meta.start === 0 && response.meta.limit < response.meta.count) {
        postTripFactory.getStationList(companyId, response.meta.limit + 1).then($this.getStationsSuccess);
      }
    };

    this.getEmployeesSuccess = function (response) {
      $scope.employees = response.companyEmployees;
    };

    this.getSchedulesSuccess = function (response) {
      $scope.schedules = response.distinctSchedules;
    };

    this.getCarrierSuccess = function (response) {
      $scope.carrierNumbers = [];
      angular.forEach(response.response, function (item) {
        postTripFactory.getCarrierNumbers(companyId, item.id).then(function (response) {
          $scope.carrierNumbers = $scope.carrierNumbers.concat(response.response);
        });
      });
    };

    this.saveFormSuccess = function (response) {
      $this.hideLoadingModal();
      if ($routeParams.state === 'create') {
        $location.path('post-trip-data-list').search({newTripId: response.id});
      } else {
        $this.showToastMessage('success', 'Edit Post Trip', 'success');
      }
    };

    this.saveFormFailure = function (dataFromAPI) {
      $this.hideLoadingModal();
      $scope.displayError = true;
      $scope.errorResponse = angular.copy(dataFromAPI);
    };

    this.populateSelectedEmployeesFromPostTrip = function () {
      $scope.selectedEmployees.employeeIds = [];
      angular.forEach($scope.postTrip.postTripEmployeeIdentifiers, function (value) {
        var employeeMatch = $scope.employees.filter(function (employee) {
          return employee.id === value.employeeId;
        })[0];
        if (employeeMatch) {
          $scope.selectedEmployees.employeeIds.push(employeeMatch);
        }
      });
    };

    this.showToastMessage = function (className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    this.createPostTrip = function () {
      $this.checkForExistingPostTripThenCreateOrOverwrite();
    };

    this.checkForExistingPostTripThenCreateOrOverwrite = function () {
      $this.showLoadingModal('Saving Post Trip Data');
      postTripFactory.getPostTripDataList(companyId, {
        scheduleNumber: $scope.postTrip.scheduleNumber,
        scheduleStartDate: $scope.postTrip.scheduleDate,
        scheduleEndDate: $scope.postTrip.scheduleDate
      })
        .then($this.callCreateOrEditIfPostTripExists);
    };

    this.callCreateOrEditIfPostTripExists = function (response) {
      if (response.postTrips.length > 0) {
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

    this.editPostTrip = function () {
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

    $scope.overwritePostTrip = function () {
      $scope.postTrip.id = $scope.overwritePostTripId;
      $this.editPostTrip();
    };

    this.init = function () {

      $scope.employees = [];
      companyId = postTripFactory.getCompanyId();
      postTripFactory.getStationList(companyId).then($this.getStationsSuccess);
      postTripFactory.getCarrierTypes(companyId).then($this.getCarrierSuccess);
      postTripFactory.getEmployees(companyId).then($this.getEmployeesSuccess);
      postTripFactory.getSchedules(companyId).then($this.getSchedulesSuccess);

      if ($routeParams.id) {
        $this.showLoadingModal('Loading Data');
        postTripFactory.getPostTrip(companyId, $routeParams.id).then($this.getPostTripSuccess);
      }

      var initFunctionName = ($routeParams.state + 'Init');
      if ($this[initFunctionName]) {
        $this[initFunctionName]();
      }

    };

    this.init();

    $scope.$watchGroup(['postTrip', 'stationList'], function () {
      if ($scope.postTrip && $scope.stationList) {
        $scope.updateArrivalTimeZone();
        $scope.updateDepartureTimeZone();
        $this.hideLoadingModal();
      }
    });

    this.getTimeZoneForStationId = function (stationId) {
      var matchingStation = $scope.stationList.filter(function (station) {
        return station.stationId.toString() === stationId.toString();
      })[0];
      if(matchingStation) {
        return matchingStation.timezone + ' [UTC ' + matchingStation.utcOffset + ']';
      }
      return '';
    };

    $scope.updateArrivalTimeZone = function () {
      if ($scope.postTrip === undefined || $scope.postTrip.arrStationId === undefined) {
        return;
      }
      $scope.arrivalTimezone = $this.getTimeZoneForStationId($scope.postTrip.arrStationId);
    };

    $scope.updateDepartureTimeZone = function () {
      if ($scope.postTrip === undefined || $scope.postTrip.depStationId === undefined) {
        return;
      }
      $scope.departureTimezone = $this.getTimeZoneForStationId($scope.postTrip.depStationId);
    };

    this.formatEmployeeIdentifiersForAPI = function () {
      $scope.postTrip.postTripEmployeeIdentifiers = [];
      angular.forEach($scope.selectedEmployees.employeeIds, function (value) {
        $scope.postTrip.postTripEmployeeIdentifiers.push({employeeId: value.id});
      });
    };

    this.validateEmployees = function() {
      var shouldValidateEmployeeIds = ($scope.employees.length > 0);
      var isSelectedEmployeesInvalid = ($scope.selectedEmployees.employeeIds === undefined || $scope.selectedEmployees.employeeIds.length <= 0);
      if(shouldValidateEmployeeIds && isSelectedEmployeesInvalid) {
        $scope.postTripDataForm.employeeIds.$setValidity('pattern',true);
        return;
      }
      $scope.postTripDataForm.employeeIds.$setValidity('pattern',false);
    };

    this.validateForm = function() {
      $this.validateEmployees();
      return $scope.postTripDataForm.$valid;
    };

    $scope.formSave = function () {
      if( $this.validateForm() ) {
        $this.formatEmployeeIdentifiersForAPI();
        var saveFunctionName = ($routeParams.state + 'PostTrip');
        if ($this[saveFunctionName]) {
          $this[saveFunctionName]();
        }
      }
    };

  });
