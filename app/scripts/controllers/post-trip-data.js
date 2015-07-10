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
  .controller('PostFlightDataCtrl', function ($scope, postTripFactory, $location, $routeParams, ngToast) {
    $('.employeeID-multiple-select').select2();

    var _companyId = '403',
      _services = null;
    var $this = this;

    $scope.viewName = 'Post Trip Data';
    $scope.readOnly = false;
    $scope.postTrip = {};

    this.initCreateView = function () {
      $scope.readOnly = false;
      $scope.viewName = 'Create Post Trip Data';
    };

    this.initReadView = function () {
      $scope.readOnly = true;
      $this.getPostTrip();
      $('.employeeID-multiple-select').prop('disabled', true);
    };

    this.initUpdateView = function () {
      $scope.readOnly = false;
      $this.getPostTrip();
    };

    this.getPostTrip = function () {
      return postTripFactory.getPostTrip(_companyId, $routeParams.id).then(function (response) {
        $scope.postTrip = response;
        $scope.updateArrivalTimeZone();
        $scope.updateDepartureTimeZone();
        $scope.postTrip.scheduleDate = moment($scope.postTrip.scheduleDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
      });
    };

    this.showMessage = function(isError, message) {
      var messageType = isError ? 'error' : 'success';
      ngToast.create({
        className: messageType,
        dismissButton: true,
        content: '<strong>Post Trip</strong>:' + message
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
        getCarrierNumbers: function () {
          $scope.carrierNumbers = [];
          return postTripFactory.getCarrierTypes(_companyId).then(function (response) {
            angular.forEach(response.response, function (item) {
              postTripFactory.getCarrierNumbers(_companyId, item.id).then(function (response) {
                $scope.carrierNumbers = $scope.carrierNumbers.concat(response.response);
              });
            });
          });
        }
      };
      _services.call(['getStationList', 'getCarrierNumbers']);

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

    $scope.updateArrivalTimeZone = function () {
      angular.forEach($scope.stationList, function(value){
        if(value.stationId == $scope.postTrip.arrStationId) {
          $scope.arrivalTimezone = value.timezone + ' [UTC ' + value.utcOffset + ']';
        }
      });
    };

    $scope.updateDepartureTimeZone = function () {
      angular.forEach($scope.stationList, function(value){
        if(value.stationId == $scope.postTrip.depStationId) {
          $scope.departureTimezone = value.timezone + ' [UTC ' + value.utcOffset + ']';
        }
      });
    };

    $scope.formSave = function () {
      // TODO: fix once post trip API is finished and tested
      // TODO: validate data formats and check that values cannot be null

      $scope.postTrip.scheduleDate = moment($scope.postTrip.scheduleDate, 'MM/DD/YYYY').format('YYYYMMDD');

      $scope.postTrip.postTripEmployeeIdentifiers = [];
      var employeeIds = $('.employeeID-multiple-select').select2('val');
      angular.forEach(employeeIds, function (value) {
        $scope.postTrip.postTripEmployeeIdentifiers.push({employeeIdentifier: value});
      });
      if ($routeParams.state === 'create') {
        console.log($scope.postTrip);
        postTripFactory.createPostTrip(_companyId, $scope.postTrip).then(function(response){
          // TODO: ngToast succes
        }, function(error){
          // TODO: ngToast error
        });
      } else {
        delete $scope.postTrip.depTimeZone;
        delete $scope.postTrip.arrTimeZone;
        console.log($scope.postTrip);
        postTripFactory.updatePostTrip(_companyId, $scope.postTrip);
      }
    };


  });
