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
          return postTripFactory.getPostTripDataList(_companyId, {});
        },
        getStationList: function () {
          return postTripFactory.getStationList(_companyId).then(function (response) {
            $scope.stationList = response.response;
            $('.stations-multi-select').select2({width: '100%'});
          });
        },
        getCarrierTypes: function () {
          return postTripFactory.getCarrierTypes(_companyId).then(function (response) {
            $scope.carrierTypes = response.response;
          });
        }
      };
      _services.call(['getPostTripDataList', 'getStationList', 'getCarrierTypes']);
    })();


    $scope.searchPostTripData = function () {
      console.log($scope.search.scheduleNumber);
      // TODO: call API with search object
    };

    $scope.clearSearchForm = function () {
      $('.stations-multi-select').select2('data', null);
      $scope.search = {};
      // TODO: call API with empty search object
    };

    $scope.updateCarrierNumbers = function () {
      postTripFactory.getCarrierNumbers(_companyId, $scope.search.carrierTypeId).then(function (response) {
        $scope.carrierNumbers = response.response;
      }, function () {
        $scope.carrierNumbers = [];
      });
    };

    $scope.viewPostTrip = function () {
      $location.path('post-trip-data/view/' + 1);
    };

    $scope.editPostTrip = function () {
      $location.path('post-trip-data/edit/' + 1);
    };

    $scope.deletePostTrip = function () {
      // TODO: delete
    };


  });
