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
  .controller('PostFlightDataCtrl', function ($scope, postTripFactory, $location, $routeParams, ngToast, dateUtility) {
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
      });
    };

    this.showMessage = function(error, isError, message) {
      // TODO: add displayError dialog once API is fixed and returns error codes
      if(arguments.length < 2) {
        isError = true;
        message = 'error';
      }
      var messageType = isError ? 'danger' : 'success';
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
      $scope.postTrip.postTripEmployeeIdentifiers = [];
      var employeeIds = $('.employeeID-multiple-select').select2('val');
      angular.forEach(employeeIds, function (value) {
        $scope.postTrip.postTripEmployeeIdentifiers.push({employeeIdentifier: value});
      });

      if ($routeParams.state === 'create') {
        postTripFactory.createPostTrip(_companyId, $scope.postTrip).then(function(response){
          $location.path('post-trip-data-list');
        }, function(error){
          $this.showMessage(error);
        });
      } else {
        // TODO: temporary -- remove once API is fixed and can accept depTImeZone and arrTimeZone
        delete $scope.postTrip.depTimeZone;
        delete $scope.postTrip.arrTimeZone;
        var payload = angular.copy($scope.postTrip);
        postTripFactory.updatePostTrip(_companyId, payload).then(function(){
          $this.showMessage(null, false, 'PostTrip successfully updated');
        }, function(error) {
          $this.showMessage(error);
        });
      }
    };


  });
