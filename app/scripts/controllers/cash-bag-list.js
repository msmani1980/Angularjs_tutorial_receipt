'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagListCtrl
 * @description
 * # CashBagListCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagListCtrl', function ($scope, cashBagService, GlobalMenuService, stationsService, $location) {
  	var companyId = GlobalMenuService.company.get();
  	cashBagService.getCashBagList(companyId).then(function(response){
  		$scope.cashBagList = response.cashBags;
  	});

    stationsService.getStationList(companyId).then(function(response){
      $scope.stationList = response.response;
    });

    $scope.showCashBag = function (cashBag) {
      $location.path('cash-bag-create/' + cashBag.id);
    };

  });
