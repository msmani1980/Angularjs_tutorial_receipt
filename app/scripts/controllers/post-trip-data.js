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
    var _companyId = '403',
      _services = null;
    var $this = this;

    $scope.viewName = 'Post Trip Data';
    $scope.readOnly = false;
    $scope.postTrip = {};
    $scope.selectedEmployees = {};

    this.showLoadingModal = function(message) {
      angular.element('#loading').modal('show').find('p').text(message);
    };

    this.hideLoadingModal = function() {
      angular.element('#loading').modal('hide');
    };

    this.initCreateView = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Create Post Trip Data';
    };

    this.initReadView = function () {
      $scope.readOnly = true;
      $this.showLoadingModal('Loading Post Trip Data');
      $this.getPostTrip();
    };

    this.initUpdateView = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Post Trip Data';
      $this.showLoadingModal('Loading Post Trip Data');
      $this.getPostTrip();
    };

    this.getPostTripSuccess = function (response) {
      $scope.postTrip = response;
      $scope.updateArrivalTimeZone();
      $scope.updateDepartureTimeZone();
      $this.populateEmployees();
      $this.hideLoadingModal();
    };

    this.getStationsSuccess = function (response) {
      $scope.stationList = response.response;
    };

    this.getEmployeesSuccess = function (response) {
      $scope.employees = response.companyEmployees;
    };

    this.getCarrierSuccess = function (response) {
      angular.forEach(response.response, function (item) {
        postTripFactory.getCarrierNumbers(_companyId, item.id).then(function (response) {
          $scope.carrierNumbers = $scope.carrierNumbers.concat(response.response);
        });
      });
    };

    this.saveFormSuccess = function (response) {
      $this.hideLoadingModal();
      if($routeParams.state === 'create') {
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

    this.getPostTrip = function () {
      return postTripFactory.getPostTrip(_companyId, $routeParams.id).then($this.getPostTripSuccess);
    };

    this.populateEmployees = function () {
      // TODO: populate employee Id field once employees API is fixed on BE
      //angular.forEach($scope.postTrip.postTripEmployeeIdentifiers, function(value){
      //  $scope.employees.employeeIds.push({id: value.id});
      //});
    };

    this.showToastMessage = function (className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    this.saveNewTrip = function () {
      postTripFactory.createPostTrip(_companyId, $scope.postTrip).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    this.saveUpdatedTrip = function () {
      // TODO: temporary -- remove once API is fixed and can accept depTImeZone and arrTimeZone
      delete $scope.postTrip.depTimeZone;
      delete $scope.postTrip.arrTimeZone;
      var payload = angular.copy($scope.postTrip);
      postTripFactory.updatePostTrip(_companyId, payload).then(
        $this.saveFormSuccess,
        $this.saveFormFailure
      );
    };

    (function initController() {
      // set global controller properties
      _companyId = postTripFactory.getCompanyId();
      _services = {
        promises: [],
        call: function (servicesArray) {
          angular.forEach(servicesArray, function (_service) {
            _services.promises.push(_services[_service]());
          });
        },
        getStationList: function () {
          return postTripFactory.getStationList(_companyId).then($this.getStationsSuccess);
        },
        getCarrierNumbers: function () {
          $scope.carrierNumbers = [];
          return postTripFactory.getCarrierTypes(_companyId).then($this.getCarrierSuccess);
        },
        getEmployees: function() {
          $scope.employees = [];
          return postTripFactory.getEmployees(_companyId).then($this.getEmployeesSuccess);
        }
      };
      _services.call(['getStationList', 'getCarrierNumbers', 'getEmployees']);

      switch ($routeParams.state) {
        case 'create':
          $this.initCreateView();
          break;
        case 'view':
          $this.initReadView();
          break;
        case 'edit':
          $this.initUpdateView();
          break;
        default:
          $this.initReadView();
          break;
      }
    })();

    $scope.updateArrivalTimeZone = function () {
      if($scope.postTrip === undefined || $scope.postTrip.arrStationId === undefined) {
        return;
      }
      angular.forEach($scope.stationList, function (value) {
        if (value.stationId.toString() === $scope.postTrip.arrStationId.toString()) {
          $scope.arrivalTimezone = value.timezone + ' [UTC ' + value.utcOffset + ']';
        }
      });
    };

    $scope.updateDepartureTimeZone = function () {
      if($scope.postTrip === undefined || $scope.postTrip.depStationId === undefined) {
        return;
      }
      angular.forEach($scope.stationList, function (value) {
        if (value.stationId.toString() === $scope.postTrip.depStationId.toString()) {
          $scope.departureTimezone = value.timezone + ' [UTC ' + value.utcOffset + ']';
        }
      });

    };

    $scope.formSave = function () {
      // TODO: move employeeId data validation to HTML (currently open bug https://github.com/angular-ui/ui-select/issues/258)
      var shouldValidateEmployeeIds = ($scope.employees.length > 0);
      var isSelectedEmployeesInvalid = ($scope.selectedEmployees.employeeIds === undefined || $scope.selectedEmployees.employeeIds.length <= 0);
      if (!$scope.postTripDataForm.$valid || (shouldValidateEmployeeIds && isSelectedEmployeesInvalid)) {
        $this.showToastMessage('danger', 'Post Trips', 'Please complete all fields');
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
