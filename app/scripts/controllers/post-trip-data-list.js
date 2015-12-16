'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataListCtrl', function ($scope, postTripFactory, $location, ngToast, dateUtility, lodash) {
    var companyId = '';
    var $this = this;
    this.meta = {
      count: undefined,
      limit: 100,
      offset: 0
    };

    $scope.viewName = 'Post Trip Data';
    $scope.search = {};
    $scope.multiSelectedValues = {};
    $scope.stationList = [];
    $scope.postTrips = [];

    function showLoadingBar() {
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }


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
      $this.meta.count = $this.meta.count || response.meta.count;
      // TODO: move offset to service layer
      $scope.postTrips =  $scope.postTrips.concat(response.postTrips);
      $this.updateStationCodes();
      hideLoadingBar();
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
      $scope.postTrips = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadPostTrip();
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
      postTripFactory.getStationList(companyId).then($this.getStationsSuccess);
      postTripFactory.getCarrierTypes(companyId).then($this.getCarrierSuccess);
      postTripFactory.getEmployees(companyId).then($this.getEmployeesSuccess);
      $this.showNewPostTripSuccess();
    };

    this.init();

    function loadPostTrip() {
      if ($this.meta.offset >= $this.meta.count) {
        return;
      }
      showLoadingBar();
      $this.formatMultiSelectedValuesForSearch();
      var payload = lodash.assign(angular.copy($scope.search), {
        limit: $this.meta.limit,
        offset: $this.meta.offset
      });

      postTripFactory.getPostTripDataList(companyId, payload).then($this.getPostTripSuccess);
      $this.meta.offset += $this.meta.limit;
    }

    $scope.loadPostTrip = function() {
      loadPostTrip();
    };

    $scope.searchPostTripData = function () {
      $scope.postTrips = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadPostTrip();
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      $scope.searchPostTripData();
    };



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

    $scope.redirectToPostTrip = function (id, state) {
      $location.search({});
      $location.path('post-trip-data/' + state + '/' + id).search();
    };

    $scope.removeRecord = function (postTrip) {
      if (!postTrip || $scope.postTrips.length <= 0) {
        $this.deletePostTripFailure();
        return;
      }
      postTripFactory.deletePostTrip(companyId, postTrip.id).then(
        $this.deletePostTripSuccess,
        $this.deletePostTripFailure
      );
    };

    $scope.showDeleteButton = function (dateString) {
      return dateUtility.isAfterToday(dateString);
    };
  });
