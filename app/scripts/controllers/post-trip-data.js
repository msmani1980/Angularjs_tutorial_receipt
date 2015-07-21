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
      $this.populateEmployees();
    };

    this.getStationsSuccess = function (response) {
      $scope.stationList = response.response;
    };

    this.getEmployeesSuccess = function (response) {
      $scope.employees = response.companyEmployees;
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
        $location.path('post-trip-data-list').search({updateType: 'create', id: response.id});
      } else {
        $this.showToastMessage('success', 'Edit Post Trip', 'success');
      }
    };

    this.saveFormFailure = function () {
      // TODO: add displayError dialog once API is fixed and returns error codes
      $this.hideLoadingModal();
      $this.showToastMessage('danger', 'Post Trips', 'error');
    };

    this.populateEmployees = function () {
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

    this.saveNewTrip = function () {
      postTripFactory.createPostTrip(companyId, $scope.postTrip).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.saveUpdatedTrip = function () {
      // TODO: temporary -- remove once API is fixed and can accept depTImeZone and arrTimeZone
      delete $scope.postTrip.depTimeZone;
      delete $scope.postTrip.arrTimeZone;
      var payload = angular.copy($scope.postTrip);
      postTripFactory.updatePostTrip(companyId, payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.init = function () {

      $scope.employees = [];
      companyId = postTripFactory.getCompanyId();
      postTripFactory.getStationList(companyId).then($this.getStationsSuccess);
      postTripFactory.getCarrierTypes(companyId).then($this.getCarrierSuccess);
      postTripFactory.getEmployees(companyId).then($this.getEmployeesSuccess);

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

    $scope.updateArrivalTimeZone = function () {
      if ($scope.postTrip === undefined || $scope.postTrip.arrStationId === undefined) {
        return;
      }
      angular.forEach($scope.stationList, function (value) {
        if (value.stationId.toString() === $scope.postTrip.arrStationId.toString()) {
          $scope.arrivalTimezone = value.timezone + ' [UTC ' + value.utcOffset + ']';
        }
      });
    };

    $scope.updateDepartureTimeZone = function () {
      if ($scope.postTrip === undefined || $scope.postTrip.depStationId === undefined) {
        return;
      }
      angular.forEach($scope.stationList, function (value) {
        if (value.stationId.toString() === $scope.postTrip.depStationId.toString()) {
          $scope.departureTimezone = value.timezone + ' [UTC ' + value.utcOffset + ']';
        }
      });

    };

    $scope.formSave = function () {
      if (!$scope.postTripDataForm.$valid) {
        $this.showToastMessage('danger', 'Post Trips', 'Please complete all fields');
        return;
      }
      // TODO: move employeeId data validation to HTML (currently open bug https://github.com/angular-ui/ui-select/issues/258)
      var shouldValidateEmployeeIds = ($scope.employees.length > 0);
      var isSelectedEmployeesInvalid = ($scope.selectedEmployees.employeeIds === undefined || $scope.selectedEmployees.employeeIds.length <= 0);
      if (shouldValidateEmployeeIds && isSelectedEmployeesInvalid) {
        $this.showToastMessage('danger', 'Post Trips', 'Please complete employee ID field');
        return;
      }
      $scope.postTrip.postTripEmployeeIdentifiers = [];
      angular.forEach($scope.selectedEmployees.employeeIds, function (value) {
        $scope.postTrip.postTripEmployeeIdentifiers.push({employeeId: value.id});
      });

      $this.showLoadingModal('Saving Post Trip Data');
      if ($routeParams.state === 'create') {
        $this.saveNewTrip();
      } else {
        $this.saveUpdatedTrip();
      }
    };

  });
