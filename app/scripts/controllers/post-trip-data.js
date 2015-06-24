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
  .controller('PostFlightDataCtrl', function ($scope, postTripFactory, $location, $routeParams, $q) {
    $('.employeeID-multiple-select').select2();

    var _companyId = '403',
      _services = null;

    $scope.viewName = 'Post Trip Data';
    $scope.readOnly = false;
    $scope.postTrip = {};

    (function CONSTRUCTOR() {
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
        getCarrierTypes: function() {
          return postTripFactory.getCarrierTypes(_companyId).then(
            function (response) {
              $scope.carrierTypes = response.response;
            }
          );
        }
      };
      _services.call(['getStationList', 'getCarrierTypes']);
    })();

    $scope.updateCarrierNumbers = function() {
      postTripFactory.getCarrierNumbers(_companyId, $scope.carrierTypeId).then(function(response){
        $scope.carrierNumbers = response.response;
      }, function(){
        $scope.carrierNumbers = [];
      });
    };

    $scope.updateArrivalInfo = function() {
      var station = $scope.stationList[$scope.arrivalStationIndex];
      $scope.postTrip.arrivalStation = station.stationName;
      $scope.postTrip.arrivalTimezone = station.timezone + ' [UTC ' + station.utcOffset + ']';
    };

    $scope.updateDepartureInfo = function() {
      var station = $scope.stationList[$scope.departureStationIndex];
      $scope.postTrip.departureStation = station.stationName;
      $scope.postTrip.departureTimezone = station.timezone + ' [UTC ' + station.utcOffset + ']';
    };
    //
    //function CREATE(){
    //  // create
    //  // create/back button
    //}
    //
    //function READ(){
    //  // view
    //  // readOnly
    //  // autopopulate fields
    //}
    //
    //function UPDATE(){
    //
    //  // edit
    //  // autopopulate fields
    //  // save/back button
    //}
    //
    //


  });
