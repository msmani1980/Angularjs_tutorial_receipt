'use strict';
/* global moment*/
/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataListCtrl', function ($scope, postTripFactory, $location, ngToast) {
    var _companyId = '403',
      _services = null;
    var $this = this;

    $scope.viewName = 'Post Trip Data';
    $scope.search = {};
    $scope.multiSelectedValues = {};
    $scope.stationList = [];
    $scope.postTrips = [];

    this.getStationById = function (stationId) {
      var stationCode = '';
      if (stationId === undefined || $scope.stationList.length <= 0) {
        return '';
      }
      angular.forEach($scope.stationList, function (value) {
        if (value.stationId.toString() === stationId.toString()) {
          stationCode = value.stationCode.toString();
        }
      });
      return stationCode;
    };

    this.updateStationCodes = function () {
      if ($scope.postTrips.length > 0 && $scope.stationList.length > 0) {
        angular.forEach($scope.postTrips, function (trip) {
          trip.depStationCode = $this.getStationById(trip.depStationId);
          trip.arrStationCode = $this.getStationById(trip.arrStationId);
        });
      }
    };

    this.getPostTripSuccess = function (response) {
      $scope.postTrips = response.postTrips;
      $this.updateStationCodes();
    };

    this.getStationsSuccess = function (response) {
      $scope.stationList = response.response;
      // TODO: fix this hack! currently ui-select doesn't populate correctly when collapsed or when multiple
      angular.element('#search-collapse').addClass('collapse');
      $this.updateStationCodes();
    };

    this.getCarrierSuccess = function (response) {
      angular.forEach(response.response, function (item) {
        postTripFactory.getCarrierNumbers(_companyId, item.id).then(function (response) {
          $scope.carrierNumbers = $scope.carrierNumbers.concat(response.response);
        });
      });
    };

    this.getEmployeesSuccess = function (response) {
      $scope.employees = response.companyEmployees;
    };

    this.showToastMessage = function (className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };


    this.uploadPostTripSuccess = function () {
      $this.showToastMessage('success', 'Upload Post Trip', 'upload successful!');
    };

    this.uploadPostTripFailure = function () {
      $this.showToastMessage('danger', 'Upload Post Trip', 'upload failed');
    };

    this.deletePostTripSuccess = function () {
      $this.showToastMessage('success', 'Post Trip', 'Post Trip successfully deleted');
      postTripFactory.getPostTripDataList(_companyId, {}).then($this.getPostTripSuccess);
    };

    this.deletePostTripFailure = function () {
      $this.showToastMessage('danger', 'Post Trip', 'Post Trip could not be deleted');
    };

    this.showNewPostTripSuccess = function () {
      if ($location.search().updateType === 'create') {
        $this.showToastMessage('success', 'Create Post Trip', 'successfully added post trip id:' + $location.search().id);
      } else if ($location.search().updateType === 'edit') {
        $this.showToastMessage('success', 'Edit Post Trip', 'successfully updated post trip id:' + $location.search().id);
      }
    };

    (function constructor() {
      // set global controller properties
      _companyId = postTripFactory.getCompanyId();
      _services = {
        promises: [],
        call: function (servicesArray) {
          angular.forEach(servicesArray, function (_service) {
            _services.promises.push(_services[_service]());
          });
        },
        getPostTripDataList: function () {
          return postTripFactory.getPostTripDataList(_companyId, {}).then($this.getPostTripSuccess);
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
      _services.call(['getStationList', 'getPostTripDataList', 'getCarrierNumbers', 'getEmployees']);
      $this.showNewPostTripSuccess();
    })();

    this.formatMultiSelectedValuesForSearch = function () {
      $scope.search.depStationId = [];
      $scope.search.arrStationId = [];
      $scope.search.tailNumber = [];
      $scope.search.employeeId = [];
      angular.forEach($scope.multiSelectedValues.tailNumbers, function (number) {
        $scope.search.tailNumber.push(number.carrierNumber);
      });
      angular.forEach($scope.multiSelectedValues.depStations, function (station) {
        $scope.search.depStationId.push(station.stationId);
      });
      angular.forEach($scope.multiSelectedValues.arrStations, function (station) {
        $scope.search.arrStationId.push(station.stationId);
      });
      angular.forEach($scope.multiSelectedValues.employeeIds, function (employee) {
        $scope.search.employeeId.push(employee.id);
      });
    };

    $scope.searchPostTripData = function () {
      $this.formatMultiSelectedValuesForSearch();
      var payload = angular.copy($scope.search);
      postTripFactory.getPostTripDataList(_companyId, payload).then($this.getPostTripSuccess);
    };

    $scope.clearSearchForm = function () {
      $scope.multiSelectedValues = {};
      $scope.search = {};
      postTripFactory.getPostTripDataList(_companyId, $scope.search).then($this.getPostTripSuccess);
    };

    $scope.redirectToPostTrip = function (id, state) {
      $location.search({});
      $location.path('post-trip-data/' + state + '/' + id).search();
    };

    $scope.promptDeleteModal = function (index) {
      $scope.tempDeleteIndex = index;
      angular.element('#delete-modal').modal('show');
    };

    $scope.deletePostTrip = function () {
      if ($scope.postTrips.length <= 0) {
        $this.deletePostTripFailure();
        return;
      }
      var postTripId = $scope.postTrips[$scope.tempDeleteIndex].id;
      postTripFactory.deletePostTrip(_companyId, postTripId).then(
        $this.deletePostTripSuccess,
        $this.deletePostTripFailure
      );
    };

    $scope.showDeleteButton = function (dateString) {
      var scheduleDate = moment(dateString, 'YYYY-MM-DD');
      var today = moment();
      return !scheduleDate.isBefore(today);
    };

    $scope.uploadPostTripFileToApi = function (files) {
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          postTripFactory.uploadPostTrip(_companyId, file, $this.uploadPostTripSuccess, $this.uploadPostTripFailure);
        }
      }
    };
  });
