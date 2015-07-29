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
      if (!stationId || $scope.stationList.length <= 0) {
        return '';
      }
      angular.forEach($scope.stationList, function (value) {
        if (value.stationId === stationId) {
          stationCode = value.stationCode;
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
      // TODO: move offset to service layer
      $scope.postTrips =  $scope.postTrips.concat(response.postTrips);
      if(response.meta.start === 0 && response.meta.limit < response.meta.count) {
        postTripFactory.getPostTripDataList(companyId, {offset: response.meta.limit + 1}).then($this.getPostTripSuccess);
      }
      $this.updateStationCodes();
    };

    this.searchPostTripSuccess = function (response) {
      $scope.postTrips = response.postTrips;
    };

    this.getStationsSuccess = function (response) {
      // TODO: move offset to service layer
      $scope.stationList = $scope.stationList.concat(response.response);

      if(response.meta.start === 0 && response.meta.limit < response.meta.count) {
        postTripFactory.getStationList(companyId, response.meta.limit + 1).then($this.getStationsSuccess);
      }
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

    this.addSearchValuesFromMultiSelectArray = function (searchKeyName, multiSelectArray, multiSelectElementKey) {
      if(multiSelectArray && multiSelectArray.length > 0) {
        $scope.search[searchKeyName] = [];
      }
      angular.forEach(multiSelectArray, function (element) {
        $scope.search[searchKeyName].push(element[multiSelectElementKey]);
      });
    };

    this.formatMultiSelectedValuesForSearch = function () {
      $this.addSearchValuesFromMultiSelectArray('depStationId', $scope.multiSelectedValues.depStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('arrStationId', $scope.multiSelectedValues.arrStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('tailNumber', $scope.multiSelectedValues.tailNumbers, 'carrierNumber');
      $this.addSearchValuesFromMultiSelectArray('employeeId', $scope.multiSelectedValues.employeeIds, 'id');
    };

    $scope.searchPostTripData = function () {
      $this.formatMultiSelectedValuesForSearch();
      var payload = angular.copy($scope.search);
      postTripFactory.getPostTripDataList(companyId, payload).then($this.searchPostTripSuccess);
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
  });
