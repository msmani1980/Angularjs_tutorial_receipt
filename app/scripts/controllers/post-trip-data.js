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
    };

    this.initReadView = function() {
      $scope.readOnly = true;
      $('.employeeID-multiple-select').prop('disabled', true);
      $this.getPostTrip();
    };

    this.initUpdateView = function() {
      $scope.readOnly = false;
      $this.getPostTrip();
    };

    this.getPostTrip = function() {
      return postTripFactory.getPostTrip(_companyId, $routeParams.id).then(function(response){
        $scope.postTrip = response;
        $scope.departureStationIndex = response.depStationId;
        $scope.updateDepartureInfo();
        $scope.arrivalStationIndex = response.arrivalStationId;
        $scope.updateArrivalInfo();

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
      if($scope.arrivalStationIndex && $scope.arrivalStationIndex < $scope.stationList.length) {
        console.log('hi');
        var station = $scope.stationList[$scope.arrivalStationIndex];
        $scope.postTrip.arrStationId = station.stationId;
        $scope.arrivalTimezone = station.timezone + ' [UTC ' + station.utcOffset + ']';
      }
    };

    $scope.updateDepartureInfo = function () {
      if($scope.departureStationIndex && $scope.departureStationIndex < $scope.stationList.length) {
        var station = $scope.stationList[$scope.departureStationIndex];
        $scope.postTrip.depStationId = station.stationId;
        $scope.departureTimezone = station.timezone + ' [UTC ' + station.utcOffset + ']';
      }

    };

    $scope.formSave = function() {
      // TODO: fix once post trip API is finished and tested
      // TODO: validate data formats and check that values cannot be null

      $scope.postTrip.scheduleDate = moment($scope.postTrip.scheduleDate, 'MM/DD/YYYY').format('YYYYMMDD');

      $scope.postTrip.postTripEmployeeIdentifiers = [];
      var employeeIds = $('.employeeID-multiple-select').select2('val');
      angular.forEach(employeeIds, function(value) {
        $scope.postTrip.postTripEmployeeIdentifiers.push({employeeIdentifier:value});
      });
      if($routeParams.state === 'create') {
        postTripFactory.createPostTrip(_companyId, $scope.postTrip);
      } else {
        console.log($scope.postTrip);
        postTripFactory.editPostTrip(_companyId, $scope.postTrip);
      }
    };



  });
