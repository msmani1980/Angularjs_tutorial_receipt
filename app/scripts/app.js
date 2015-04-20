'use strict';
/*global $*/

/**
 * @ngdoc overview
 * @name ts5App
 * @description
 * # ts5App
 *
 * Main module of the application.
 */
angular
  .module('ts5App', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.bootstrap',
    'angular.filter'
  ])
  .constant('baseUrl', 'https://ec2-52-6-49-188.compute-1.amazonaws.com')
  .config(function ($routeProvider) {
    var datePickerOptions = $.extend($.fn.datepicker.defaults, {
      format: 'mm/dd/yyyy',
      autoclose: true,
      todayHighlight: true
    });
    $.fn.datepicker.defaults = datePickerOptions;

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/items', {
        templateUrl: 'views/items.html',
        controller: 'ItemsCtrl'
      })
      .when('/companies', {
        templateUrl: 'views/companies.html',
        controller: 'CompaniesCtrl'
      })
      .when('/company/:id', {
        templateUrl: 'views/company.html',
        controller: 'CompanyCtrl'
      })
      .when('/exchange-rates', {
        templateUrl: 'views/exchange-rates.html',
        controller: 'ExchangeRatesCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
