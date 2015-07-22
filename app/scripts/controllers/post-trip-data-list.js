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
    var companyId = '';
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
        postTripFactory.getCarrierNumbers(companyId, item.id).then(function (response) {
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


    this.uploadPostTripSuccess = function (response) {
      if(response.toString() === 'OK_BUT_EMAIL_FAILURE') {
        $this.showToastMessage('warning', 'Upload Post Trip', 'upload successful, but email notifications have failed');
      } else {
        $this.showToastMessage('success', 'Upload Post Trip', 'upload successful!');
      }
    };

    this.uploadPostTripFailure = function () {
      $this.showToastMessage('danger', 'Upload Post Trip', 'upload failed');
    };

    this.deletePostTripSuccess = function () {
      $this.showToastMessage('success', 'Post Trip', 'Post Trip successfully deleted');
      postTripFactory.getPostTripDataList(companyId, {}).then($this.getPostTripSuccess);
    };

    this.deletePostTripFailure = function () {
      $this.showToastMessage('danger', 'Post Trip', 'Post Trip could not be deleted');
    };

    this.showNewPostTripSuccess = function () {
      if ($location.search().newTripId) {
        $this.showToastMessage('success', 'Create Post Trip', 'successfully added post trip id:' + $location.search().newTripId);
      }
    };

    this.init = function () {
      companyId = postTripFactory.getCompanyId();
      $scope.carrierNumbers = [];
      $scope.employees = [];
      postTripFactory.getPostTripDataList(companyId, {}).then($this.getPostTripSuccess);
      postTripFactory.getStationList(companyId).then($this.getStationsSuccess);
      postTripFactory.getCarrierTypes(companyId).then($this.getCarrierSuccess);
      postTripFactory.getEmployees(companyId).then($this.getEmployeesSuccess);
      $this.showNewPostTripSuccess();
    };

    this.init();


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
      postTripFactory.getPostTripDataList(companyId, payload).then($this.getPostTripSuccess);
    };

    $scope.clearSearchForm = function () {
      $scope.multiSelectedValues = {};
      $scope.search = {};
      postTripFactory.getPostTripDataList(companyId, $scope.search).then($this.getPostTripSuccess);
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
      postTripFactory.deletePostTrip(companyId, postTripId).then(
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
          postTripFactory.uploadPostTrip(companyId, file, $this.uploadPostTripSuccess, $this.uploadPostTripFailure);
        }
      }
    };
  });
