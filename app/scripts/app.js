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
    'config',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage',
    'ui.bootstrap',
    'ui.select',
    'angular.filter',
    'ngFileUpload',
    'ja.qr',
    'ngToast',
    'ang-drag-drop'
  ])
  .constant('regexp', {
    word: /^[\w\s]+$/,
    bit: /^(0|1)$/,
    number: /^-?([0-9]*)$/,
    alpha: /^[a-zA-z]+$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    phone: /^([0-9]{3}( |-|.)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-|.)?([0-9]{3}( |-|.)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
    cc: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
    zip: /^(([0-9]{5})|([0-9]{5}[-][0-9]{4}))$/,
    decimal: /^\d+\.\d{0,4}$/,
    currencyWithFourDecimalPlace: [/^\d+\.\d{4}$/,
      'This field should use format 0.0000'
    ],
    price: /^\$?\s?[0-9\,]+(\.\d{0,4})?$/,
    url: /(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/item-list', {
        templateUrl: 'views/item-list.html',
        controller: 'ItemListCtrl'
      })
      .when('/item-create', {
        templateUrl: 'views/item-create.html',
        controller: 'ItemCreateCtrl'
      })
      .when('/item-edit/:id', {
        templateUrl: 'views/item-create.html',
        controller: 'ItemCreateCtrl'
      })
      .when('/item-view/:id', {
        templateUrl: 'views/item-create.html',
        controller: 'ItemCreateCtrl'
      })
      .when('/stock-owner-item-list', {
        templateUrl: 'views/stock-owner-item-list.html',
        controller: 'StockOwnerItemListCtrl'
      })
      .when('/stock-owner-item-create', {
        templateUrl: 'views/stock-owner-item-create.html',
        controller: 'StockOwnerItemCreateCtrl'
      })
      .when('/stock-owner-item-edit/:id', {
        templateUrl: 'views/stock-owner-item-create.html',
        controller: 'StockOwnerItemCreateCtrl'
      })
      .when('/stock-owner-item-view/:id', {
        templateUrl: 'views/stock-owner-item-create.html',
        controller: 'StockOwnerItemCreateCtrl'
      })
      .when('/company-list', {
        templateUrl: 'views/company-list.html',
        controller: 'CompanyListCtrl'
      })
      .when('/company/:id', {
        templateUrl: 'views/company.html',
        controller: 'CompanyCtrl'
      })
      .when('/store-number', {
        templateUrl: 'views/store-number-create.html',
        controller: 'StoreNumberCreateCtrl'
      })
      .when('/company-relationship-list/:id', {
        templateUrl: 'views/company-relationship.html',
        controllerAs: 'vm',
        controller: 'CompanyRelationshipListCtrl'
      })
      .when('/exchange-rates', {
        templateUrl: 'views/exchange-rates.html',
        controller: 'ExchangeRatesCtrl'
      })
      .when('/menu-list', {
        templateUrl: 'views/menu-list.html',
        controller: 'MenuListCtrl'
      })
      .when('/menu/:state/:id?', {
        templateUrl: 'views/menu-edit.html',
        controller: 'MenuEditCtrl'
      })
      .when('/cash-bag/:state/:id?', {
        templateUrl: 'views/cash-bag.html',
        controller: 'CashBagCtrl'
      })
      .when('/cash-bag-list', {
        templateUrl: 'views/cash-bag-list.html',
        controller: 'CashBagListCtrl'
      })
      .when('/post-trip-data-list', {
        templateUrl: 'views/post-trip-data-list.html',
        controller: 'PostFlightDataListCtrl'
      })
      .when('/post-trip-data/:state/:id?', {
        templateUrl: 'views/post-trip-data.html',
        controller: 'PostFlightDataCtrl'
      })
      .when('/employee-commission/:state/:id?', {
        templateUrl: 'views/employee-commission-edit.html',
        controller: 'EmployeeCommissionEditCtrl'
      })
      .when('/global-reason-code', {
        templateUrl: 'views/global-reason-code.html',
        controller: 'GlobalReasonCodeCtrl'
      })
      .when('/company-reason-code', {
        templateUrl: 'views/company-reason-code.html',
        controller: 'CompanyReasonCodeCtrl'
      })
      .when('/menu-relationship-list', {
        templateUrl: 'views/menu-relationship-list.html',
        controller: 'MenuRelationshipListCtrl'
      })
      .when('/menu-relationship-create', {
        templateUrl: 'views/menu-relationship-create.html',
        controller: 'MenuRelationshipCreateCtrl'
      })
      .when('/menu-relationship-edit/:id', {
        templateUrl: 'views/menu-relationship-create.html',
        controller: 'MenuRelationshipCreateCtrl'
      })
      .when('/menu-relationship-view/:id', {
        templateUrl: 'views/menu-relationship-create.html',
        controller: 'MenuRelationshipCreateCtrl'
      })
      .when('/item-import', {
        templateUrl: 'views/item-import.html',
        controller: 'ItemImportCtrl'
      })
      .when('/lmp-locations-list', {
        templateUrl: 'views/lmp-locations-list.html',
        controller: 'ManageLmpLocationsCtrl'
      })
      .when('/manage-goods-received', {
        templateUrl: 'views/manage-goods-received.html',
        controller: 'ManageGoodsReceivedCtrl'
      })
      .when('/lmp-delivery-note/:state/:id?', {
        templateUrl: 'views/lmp-delivery-note.html',
        controller: 'LmpDeliveryNoteCtrl'
      })
      .when('/delivery-note', {
        templateUrl: 'views/delivery-note.html',
        controller: 'DeliveryNoteCtrl'
      })
      .when('/delivery-note-review', {
        templateUrl: 'views/delivery-note-review.html',
        controller: 'DeliveryNoteReviewCtrl'
      })
      .when('/employee-commission-list', {
        templateUrl: 'views/employee-commission-list.html',
        controller: 'EmployeeCommissionListCtrl'
      })
      .when('/stock-dashboard', {
        templateUrl: 'views/stock-dashboard.html',
        controller: 'StockDashboardCtrl'
      })
      .when('/stock-take', {
        templateUrl: 'views/stock-take.html',
        controller: 'StockTakeCtrl'
      })
      .when('/stock-take-report', {
        templateUrl: 'views/stock-take-report.html',
        controller: 'StockTakeReportCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

  })
  .run(['$rootScope', 'regexp', 'GlobalMenuService', '$http', function (
    $rootScope, regexp, GlobalMenuService, $http) {

    // get the user and company
    var user = GlobalMenuService.user.get();

    // TODO: Refactor so the company object is returned, right now it's retruning a num so ember will play nice
    var companyId = GlobalMenuService.company.get();

    // sets default headers
    // TODO: Set up watch so when user and company id change, these are updated
    $http.defaults.headers.common.userId = user.id;
    $http.defaults.headers.common.companyId = companyId;

    // TODO: move this away when login is there
    $http.defaults.headers.common.sessionToken = '9e85ffbb3b92134fbf39a0c366bd3f12f0f5';

    // set regexp object into root scope for use in any template
    $rootScope.regexp = regexp;

    $rootScope.sideMenu = [{
      'title': 'Stock Owner Item Management',
      menuItems: [{
        name: 'Manage SO Items',
        route: '/#/stock-owner-item-list',
        icon: 'icon-manage-retail-item',
        className: 'dashboard-managemenuItems'
      }, {
        name: 'Create SO Item',
        route: '/#/stock-owner-item-create',
        icon: 'icon-create-retail-item',
        className: 'dashboard-createItem'
      }, {
        name: 'Manage SO Categories',
        route: 'retail-items/categories',
        icon: 'icon-manage-retail-category',
        className: 'dashboard-manageItemCategories'
      }]
    }];

  }]);
