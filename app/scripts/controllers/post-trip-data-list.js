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

    $scope.viewName = 'Post Trip Data Management';
    $scope.search = {};
    $scope.selectedStations = {};
    $scope.stationList= [];

    this.getPostTripSuccess = function(response) {
      $scope.postTrips = response.postTrips;
    };

    this.getStationsSuccess = function(response) {
      $scope.stationList = response.response;
      // TODO: reload/refresh ui-select
    };

    this.getCarrierSuccess = function(response) {
      angular.forEach(response.response, function (item) {
        postTripFactory.getCarrierNumbers(_companyId, item.id).then(function (response) {
          $scope.carrierNumbers = $scope.carrierNumbers.concat(response.response);
        });
      });
    };

    this.showToastMessage = function (className, type, message) {
      ngToast.create({
        className: className,
        dismissButton: true,
        content: '<strong>' + type + '</strong>: ' + message
      });
    };

    this.deletePostTripSuccess = function() {
      $this.showToastMessage('success', 'Post Trip', 'Post Trip successfully deleted');
      postTripFactory.getPostTripDataList(_companyId, {}).then($this.getPostTripSuccess);
    };

    this.deletePostTripFailure = function() {
      $this.showToastMessage('danger', 'Post Trip', 'Post Trip could not be deleted');
    };

    this.showNewPostTripSuccess = function() {
      if($location.search().updateType === 'create') {
        $this.showToastMessage('success', 'Create Post Trip', 'successfully added post trip id:' + $location.search().id);
      } else if($location.search().updateType === 'edit'){
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
        }
      };
      _services.call(['getPostTripDataList', 'getStationList', 'getCarrierNumbers']);
      $this.showNewPostTripSuccess();
    })();

    this.formatStationsForSearch = function() {
      $scope.search.depStationId = [];
      $scope.search.arrStationId = [];
      angular.forEach($scope.selectedStations.depStations, function(station) {
        $scope.search.depStationId.push(station.stationId);
      });
      angular.forEach($scope.selectedStations.arrStations, function(station) {
        $scope.search.arrStationId.push(station.stationId);
      });
    };

    $scope.searchPostTripData = function () {
      $this.formatStationsForSearch();
      var payload = angular.copy($scope.search);
      postTripFactory.getPostTripDataList(_companyId, payload).then($this.getPostTripSuccess);
    };

    $scope.clearSearchForm = function () {
      $scope.selectedStations = {};
      $scope.search = {};
      postTripFactory.getPostTripDataList(_companyId, $scope.search).then($this.getPostTripSuccess);
    };

    $scope.redirectToPostTrip = function(id, state) {
      $location.path('post-trip-data/' + state + '/' + id);
    };

    $scope.deletePostTrip = function (id) {
      postTripFactory.deletePostTrip(_companyId, id).then(
        $this.deletePostTripSuccess,
        $this.deletePostTripFailure
      );
    };

    $scope.showEditButton = function (dateString) {
      var scheduleDate = moment(dateString, 'YYYY-MM-DD');
      var today = moment();
      return !scheduleDate.isBefore(today);
    };


  });
