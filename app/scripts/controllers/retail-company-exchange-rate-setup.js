'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:RetailCompanyExchangeRateSetupCtrl
 * @description
 * # RetailCompanyExchangeRateSetupCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('RetailCompanyExchangeRateSetupCtrl', function ($scope) {
	  
	$scope.viewName = 'Retail Company Exchange Rate Setup';
	$scope.search = {};
	$scope.multiSelectedValues = {};
	    
	this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
