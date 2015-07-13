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
    $scope.employees = {};

    this.initCreateView = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Create Post Trip Data';
    };

    this.initReadView = function () {
      $scope.readOnly = true;
      $this.getPostTrip();
    };

    this.initUpdateView = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Edit Post Trip Data';
      $this.getPostTrip();
    };

    this.getPostTrip = function () {
      return postTripFactory.getPostTrip(_companyId, $routeParams.id).then(function (response) {
        $scope.postTrip = response;
        $scope.updateArrivalTimeZone();
        $scope.updateDepartureTimeZone();
        $this.populateEmployees();
      });
    };

    this.populateEmployees = function () {
      // TODO: populate employee Id field once employees API is fixed on BE
      //angular.forEach($scope.postTrip.postTripEmployeeIdentifiers, function(value){
      //  $scope.employees.employeeIds.push({id: value.id});
      //});
    };

    this.showMessage = function (error, isError, message) {
      // TODO: add displayError dialog once API is fixed and returns error codes
      if (arguments.length < 2) {
        isError = true;
        message = 'error';
      }
      var messageType = isError ? 'danger' : 'success';
      ngToast.create({
        className: messageType,
        dismissButton: true,
        content: '<strong>Post Trip</strong>:' + message
      });
    };

    this.saveNewTrip = function () {
      postTripFactory.createPostTrip(_companyId, $scope.postTrip).then(function () {
        $location.path('post-trip-data-list');
      }, function (error) {
        $this.showMessage(error);
      });
    };

    this.saveUpdatedTrip = function () {
      // TODO: temporary -- remove once API is fixed and can accept depTImeZone and arrTimeZone
      delete $scope.postTrip.depTimeZone;
      delete $scope.postTrip.arrTimeZone;
      var payload = angular.copy($scope.postTrip);
      postTripFactory.updatePostTrip(_companyId, payload).then(function () {
        $this.showMessage(null, false, 'PostTrip successfully updated');
      }, function (error) {
        $this.showMessage(error);
      });
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
          return postTripFactory.getStationList(_companyId).then(
            function (response) {
              $scope.stationList = response.response;
            }
          );
        },
        getCarrierNumbers: function () {
          $scope.carrierNumbers = [];
          return postTripFactory.getCarrierTypes(_companyId).then(function (response) {
            angular.forEach(response.response, function (item) {
              postTripFactory.getCarrierNumbers(_companyId, item.id).then(function (response) {
                $scope.carrierNumbers = $scope.carrierNumbers.concat(response.response);
              });
            });
          });
        },
        getEmployees: function() {
          $scope.employees = [];
          return postTripFactory.getEmployees(_companyId).then(
            function (response) {
              $scope.employees = response.companyEmployees;
              $scope.employees = [{id: 63, name: 'ted'}, {id: 66, name:'lily'}];
              //angular.element('.employeeID-multiple-select').select2({width:'100%'});
            }
          );
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
      // TODO: do employeeId data validation when employeeId API is fixed on BE
      //if (!$scope.postTripDataForm.$valid || $scope.employees.employeeIds === undefined || $scope.employees.employeeIds.length <= 0) {
      if (!$scope.postTripDataForm.$valid) {
        $this.showMessage(null, true, 'Please complete all fields');
        return;
      }
      $scope.postTrip.postTripEmployeeIdentifiers = [];
      angular.forEach($scope.employees.employeeIds, function (value) {
        $scope.postTrip.postTripEmployeeIdentifiers.push({employeeId: value.id});
      });

      if ($routeParams.state === 'create') {
        $this.saveNewTrip();
      } else {
        $this.saveUpdatedTrip();
      }
    };

  });
