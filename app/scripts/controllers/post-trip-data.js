'use strict';
/*global $*/

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataCtrl', function ($scope, postTripFactory, $location, $routeParams) {
    $('.employeeID-multiple-select').select2();

    var _companyId = '403',
      _services = null;
    var $this = this;

    $scope.viewName = 'Post Trip Data';
    $scope.readOnly = false;
    $scope.postTrip = {};

    this.initCreateView = function() {
      $scope.readOnly = false;
      $scope.viewName = 'Create Post Trip Data';

      // TODO: create/back button
    };

    this.initReadView = function() {
      $scope.readOnly = true;
      $('.employeeID-multiple-select').prop('disabled', true);
      // TODO: autopopulate fields
    };

    this.initUpdateView = function() {
      $scope.readOnly = false;
      // TODO: autopopulate fields
      // TODO: save/back button
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
        getCarrierTypes: function () {
          return postTripFactory.getCarrierTypes(_companyId).then(
            function (response) {
              $scope.carrierTypes = response.response;
            }
          );
        }
      };
      _services.call(['getStationList', 'getCarrierTypes']);

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

    $scope.updateCarrierNumbers = function () {
      postTripFactory.getCarrierNumbers(_companyId, $scope.carrierTypeId).then(function (response) {
        $scope.carrierNumbers = response.response;
      }, function () {
        $scope.carrierNumbers = [];
      });
    };

    $scope.updateArrivalInfo = function () {
      var station = $scope.stationList[$scope.arrivalStationIndex];
      $scope.postTrip.arrivalStation = station.stationName;
      $scope.postTrip.arrivalTimezone = station.timezone + ' [UTC ' + station.utcOffset + ']';
    };

    $scope.updateDepartureInfo = function () {
      var station = $scope.stationList[$scope.departureStationIndex];
      $scope.postTrip.departureStation = station.stationName;
      $scope.postTrip.departureTimezone = station.timezone + ' [UTC ' + station.utcOffset + ']';
    };


  });
