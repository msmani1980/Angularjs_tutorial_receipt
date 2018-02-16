'use strict';
/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataListCtrl', function($scope, postTripFactory, $location, messageService, dateUtility,
    lodash, $q, accessService) {

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
    $scope.loadingBarVisible = false;

    function showLoadingBar() {
      $scope.loadingBarVisible = true;
      angular.element('.loading-more').show();
    }

    function hideLoadingBar() {
      $scope.loadingBarVisible = false;
      angular.element('.loading-more').hide();
      angular.element('.modal-backdrop').remove();
    }

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

    this.updateStationCodes = function() {
      if ($scope.postTrips.length > 0 && $scope.stationList.length > 0) {
        angular.forEach($scope.postTrips, function(trip) {
          trip.depStationCode = $this.getStationById(trip.depStationId);
          trip.arrStationCode = $this.getStationById(trip.arrStationId);
        });
      }
    };

    $scope.getUpdateBy = function (postTrip) {
      if (postTrip.updatedByPerson) {
        return postTrip.updatedByPerson.userName;
      }

      if (postTrip.createdByPerson) {
        return postTrip.createdByPerson.userName;
      }

      return '';
    };

    $scope.getUpdatedOn = function (postTrip) {
      return postTrip.updatedOn ? dateUtility.formatTimestampForApp(postTrip.updatedOn) : dateUtility.formatTimestampForApp(postTrip.createdOn);
    };

    this.getPostTripSuccess = function(response) {
      $this.meta.count = $this.meta.count || response.meta.count;

      // TODO: move offset to service layer
      $scope.postTrips = $scope.postTrips.concat(response.postTrips);
      $this.updateStationCodes();
      hideLoadingBar();
    };

    this.getStationsSuccess = function(response) {
      // TODO: move offset to service layer
      var newStationList = $scope.stationList.concat(angular.copy(response.response));
      $scope.stationList = lodash.uniq(newStationList, 'stationId');

      if (response.meta.start === 0 && response.meta.limit < response.meta.count) {
        postTripFactory.getStationList(companyId, response.meta.limit).then($this.getStationsSuccess);
      }

      $this.updateStationCodes();
    };

    this.getCarrierSuccess = function(response) {
      $scope.carrierNumbers = angular.copy(response.response);
    };

    this.showToastMessage = function(className, type, message) {
      messageService.display(className, message, type);
    };

    this.deletePostTripSuccess = function() {
      $this.showToastMessage('success', 'Post Trip', 'Post Trip successfully deleted');
      $scope.postTrips = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadPostTrip();
    };

    this.deletePostTripFailure = function() {
      $this.showToastMessage('danger', 'Post Trip', 'Post Trip could not be deleted');
    };

    this.showNewPostTripSuccess = function() {
      if ($location.search().newTripId) {
        $this.showToastMessage('success', 'Create Post Trip', 'successfully added post trip id:' + $location.search()
          .newTripId);
      }
    };

    this.makeInitPromises = function() {
      var promises = [
        postTripFactory.getStationList(companyId).then($this.getStationsSuccess),
        postTripFactory.getCarrierNumbers(companyId).then($this.getCarrierSuccess)
      ];

      return promises;
    };

    this.init = function() {
      $scope.isCRUD = accessService.crudAccessGranted('POSTTRIP', 'POSTTRIP', 'CRUDPTRP');
      companyId = postTripFactory.getCompanyId();
      $scope.carrierNumbers = [];
      $scope.employees = [];

      var initDependencies = $this.makeInitPromises();
      $q.all(initDependencies).then(function() {
        $this.showNewPostTripSuccess();
        angular.element('#search-collapse').addClass('collapse');
      });
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

    $scope.searchPostTripData = function() {
      $scope.postTrips = [];
      $this.meta = {
        count: undefined,
        limit: 100,
        offset: 0
      };
      $scope.loadPostTrip();
    };

    this.searchEmployeesSuccess = function(response) {
      if ($scope.multiSelectedValues.employeeIds) {
        $scope.employees = lodash.filter(response.companyEmployees, function (employee) {
          return !lodash.find($scope.multiSelectedValues.employeeIds, { id: employee.id });
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

      if ($select.search && $select.search.length !== 0) {
        var payload = {
          search: $select.search
        };

        employeeDates(payload, $scope.search);

        postTripFactory.getEmployees(companyId, payload).then($this.searchEmployeesSuccess);
      } else {
        $scope.employees = [];
      }
    };

    function employeeDates(payload, search) {
      if (search.scheduleStartDate === undefined && search.scheduleEndDate === undefined) {
        payload.date = dateUtility.formatDateForAPI(dateUtility.nowFormattedDatePicker());
      } else if (search.scheduleStartDate === undefined || search.scheduleEndDate === undefined) {
        payload.date = dateUtility.formatDateForAPI(search.scheduleStartDate === undefined ? search.scheduleEndDate : search.scheduleStartDate);
      } else {
        payload.startDate =  dateUtility.formatDateForAPI($scope.search.scheduleStartDate);
        payload.endDate =  dateUtility.formatDateForAPI($scope.search.scheduleEndDate);
      }
    }

    $scope.clearSearchForm = function() {
      $scope.search = {};
      $scope.multiSelectedValues = {};
      $scope.postTrips = [];
    };

    this.addSearchValuesFromMultiSelectArray = function(searchKeyName, multiSelectArray, multiSelectElementKey) {
      if (!multiSelectArray || multiSelectArray.length <= 0) {
        return;
      }

      var searchArray = [];
      angular.forEach(multiSelectArray, function(element) {
        searchArray.push(element[multiSelectElementKey]);
      });

      $scope.search[searchKeyName] = searchArray.toString();
    };

    this.formatMultiSelectedValuesForSearch = function() {
      $this.addSearchValuesFromMultiSelectArray('depStationId', $scope.multiSelectedValues.depStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('arrStationId', $scope.multiSelectedValues.arrStations, 'stationId');
      $this.addSearchValuesFromMultiSelectArray('tailNumber', $scope.multiSelectedValues.tailNumbers,
        'carrierNumber');
      $this.addSearchValuesFromMultiSelectArray('employeeId', $scope.multiSelectedValues.employeeIds, 'id');
    };

    $scope.redirectToPostTrip = function(id, state) {
      $location.search({});
      $location.path('post-trip-data/' + state + '/' + id).search();
    };

    $scope.removeRecord = function(postTrip) {
      if (!postTrip || $scope.postTrips.length <= 0) {
        $this.deletePostTripFailure();
        return;
      }

      postTripFactory.deletePostTrip(companyId, postTrip.id).then(
        $this.deletePostTripSuccess,
        $this.deletePostTripFailure
      );
    };

    $scope.showDeleteButton = function(dateString) {
      return dateUtility.isAfterToday(dateString);
    };
  });
