'use strict';

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
    'angular.filter',
    'dynform'
  ])
  .constant('baseUrl', 'https://ec2-52-6-49-188.compute-1.amazonaws.com')
  .config(function ($routeProvider) {

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
      .when('/create-item', {
        templateUrl: 'views/create-item.html',
        controller: 'CreateItemCtrl'
      })
      .when('/company/:id', {
        templateUrl: 'views/company.html',
        controller: 'CompanyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    

  });
