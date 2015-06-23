'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataListCtrl', function ($scope, postTripFactory, $location, $routeParams, $q) {
    var _companyId = '403',
      _services = null;

    $scope.viewName = 'Post Trip Data Management';
    $scope.search = {};

    // Constructor
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
        getPostTripDataList: function () {
          return postTripFactory.getPostTripDataList(_companyId, {});
        },
        getStationList: function () {
          return postTripFactory.getStationList(_companyId).then(
            function (response) {
              $scope.stationList = response.response;
              //$('.stations-multi-select').select2({width: '100%'});
            }
          );
        }
      };
      _services.call(['getPostTripDataList', 'getStationList']);
    })();


    $scope.searchPostTripData = function () {
      console.log($scope.search.scheduleNumber);
      // TODO: call API with search object
    };

    $scope.clearSearchForm = function () {
      $scope.search = {};
      // TODO: call API with empty search object
    }


  });
