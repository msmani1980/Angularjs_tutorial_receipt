'use strict';

/**
 * @ngdoc function
 * @name ts5App.controller:CashBagCreateCtrl
 * @description
 * # CashBagCreateCtrl
 * Controller of the ts5App
 */
angular.module('ts5App')
  .controller('CashBagCreateCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var mochCashBag = {
     flight: 'TODO: flight',
    	date1: 'TODO: date1',
    	baseCurrency: 'TODO: DATA',
    	date2: 'TODO: date2',
    	flightSchedules: [{id:1,name:'test'},{id:2,name:'test 2'}],
    	exchanges: [
    	  ['CHF',1400.75,10.00,13.75,0.1844,0.1844],
    	  ['USD',6.66,6.00,0.66,0.1844,0.1844]
    	]
    };
    
    $scope.cashBag = mochCashBag;
  });
