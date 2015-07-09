'use strict';
/* global $*/
/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataListCtrl', function ($scope, postTripFactory, $location) {
    var _companyId = '403',
      _services = null;

    $scope.viewName = 'Post Trip Data Management';
    $scope.search = {};

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
          return postTripFactory.getPostTripDataList(_companyId, {}).then(function(response){
            $scope.postTrips = response.postTrips;
          });
        },
        getStationList: function () {
          return postTripFactory.getStationList(_companyId).then(function (response) {
            $scope.stationList = response.response;
            $('.stations-multi-select').select2({width: '100%'});
          });
        },
        getCarrierTypes: function () {
          $scope.carrierNumbers = [];
          return postTripFactory.getCarrierTypes(_companyId).then(function (response) {
            angular.forEach(response.response, function(item){
              postTripFactory.getCarrierNumbers(_companyId, item.id).then(function(response){
                $scope.carrierNumbers = $scope.carrierNumbers.concat(response.response);
              });
            });
          });
        }
      };
      _services.call(['getPostTripDataList', 'getStationList', 'getCarrierTypes']);
    })();


    $scope.searchPostTripData = function () {
      if($scope.search.scheduleDate) {
        $scope.search.scheduleDate = moment($scope.search.scheduleDate, 'MM/DD/YYYY').format('YYYYMMDD');
      }
      postTripFactory.getPostTripDataList(_companyId, $scope.search).then(function(response){
        $scope.search.scheduleDate = moment($scope.search.scheduleDate, 'YYYYMMDD').format('MM/DD/YYYY');
        $scope.search.depTime = $scope.search.depTime.toString();
        $scope.postTrips = response.postTrips;
      });
    };

    $scope.clearSearchForm = function () {
      $('.stations-multi-select').select2('data', null);
      $scope.search = {};
      postTripFactory.getPostTripDataList(_companyId, $scope.search).then(function(response){
        $scope.postTrips = response.postTrips;
      });
    };

    $scope.viewPostTrip = function (id) {
      $location.path('post-trip-data/view/' + id);
    };

    $scope.editPostTrip = function (id) {
      $location.path('post-trip-data/edit/' + id);
    };

    $scope.deletePostTrip = function (id) {
      // TODO: delete
    };


  });
