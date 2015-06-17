'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:PostFlightDataCtrl
 * @description
 * # PostFlightDataCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('PostFlightDataListCtrl', function ($scope) {
    $scope.viewName = 'Post Trip Data Management';
    
// TODO: DOWNLOAD TEMPLATE MODAL
//    $scope.checkVarianceAndSave = function(shouldSubmit) {
//        if (!$scope.dailyExchangeRatesForm.$valid){
//          return false;
//        }
//        serializePreviousExchangeRates();
//        createPayload(shouldSubmit);
//
//        $scope.varianceObject = calculateVariance();
//        if (Object.keys($scope.varianceObject).length > 0) {
//          angular.element('.variance-warning-modal').modal('show');
//          return;
//        }
//        $scope.saveDailyExchangeRates();
//      };
//
//      $scope.saveDailyExchangeRates = function () {
//        angular.element('.variance-warning-modal').modal('hide');
//        currencyFactory.saveDailyExchangeRates($scope.payload).then(successRequestHandler, showErrors);
//      };
  });
