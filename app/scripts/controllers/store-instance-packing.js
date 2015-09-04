'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:StoreInstancePackingCtrl
 * @description
 * # StoreInstancePackingCtrl
 * Controller of the ts5App
 */
angular.module('ts5App').controller('StoreInstancePackingCtrl', function ($scope, storeInstanceFactory) {
    storeInstanceFactory.getStoreDetails(5).then(function (storeDetailsJSON) {
      angular.forEach(storeDetailsJSON, function(value, key){
        $scope[key] = value;
      });
    });
  });
