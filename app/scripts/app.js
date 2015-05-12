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
    'angular.filter',
    'dynform',
    'ngFileUpload',
    'ja.qr'
  ])
  .constant('baseUrl', 'https://ec2-52-6-49-188.compute-1.amazonaws.com')
  .constant('regexp', {
      word: /^[\w\s]+$/,
      bit: /^(0|1)$/,
      number: /^-?([0-9]*)$/,
      alpha: /^[a-zA-z]+$/,
      alphanumeric:  /^[a-zA-Z0-9]+$/,
      email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
      phone: /^([0-9]{3}( |-|.)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-|.)?([0-9]{3}( |-|.)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
      cc: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
      zip: /^(([0-9]{5})|([0-9]{5}[-][0-9]{4}))$/,
      decimal: /^\d+\.\d{0,4}$/,
      price: /^\$?\s?[0-9\,]+(\.\d{0,4})?$/,
      url: /(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
  })
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
      .when('/item-list', {
        templateUrl: 'views/item-list.html',
        controller: 'ItemListCtrl'
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
      .when('/exchange-rates', {
        templateUrl: 'views/exchange-rates.html',
        controller: 'ExchangeRatesCtrl'
      })
      .when('/item-create', {
        templateUrl: 'views/item-create.html',
        controller: 'ItemCreateCtrl'
      })
      .when('/menu-list', {
        templateUrl: 'views/menu-list.html',
        controller: 'MenuListCtrl'
      })
      .when('/menu-create', {
        templateUrl: 'views/menu-create.html',
        controller: 'MenuCreateCtrl'
      })
      .when('/menu-edit/:id', {
        templateUrl: 'views/menu-edit.html',
        controller: 'MenuEditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .run(['$rootScope','regexp','GlobalMenuService', '$http', function($rootScope,regexp,GlobalMenuService,$http) {

    // get the user and company
    var user = GlobalMenuService.user.get();
    var company = GlobalMenuService.company.get();

    console.log(company.id);

    // sets default headers
    // TODO: Set up watch so when user and company id change, these are updated
    $http.defaults.headers.common.userId = user.id;
    $http.defaults.headers.common.companyId = company.id;

    // set regexp object into root scope for use in any template
    $rootScope.regexp = regexp;

  }]);
