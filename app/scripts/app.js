'use strict';

/**
 * @ngdoc overview
 * @name ts5App
 * @description
 * # ts5App
 *
 * Main module of the application.
 */
angular.module('ts5App', [
  'config',
  'angulartics',
  'angulartics.google.analytics',
  'ngAria',
  'ngAnimate',
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
  'ang-drag-drop',
  'ngLodash',
  'frapontillo.bootstrap-switch',
  'sprintf',
  'checklist-model',
  'angular-timezone-selector'
]).factory('defaultData', [
  function () {
    return {
      request: function (config) {
        if (angular.isUndefined(config.data)) {
          config.data = {
            requestTimestamp: new Date().getTime()
          };
        }

        return config;
      }
    };
  }
]).constant('regexp', {
  word: /^[\w\s]+$/,
  sentence: /[\w\s\"\'\?\._ %@&#$!,;:()\-]+$/,
  bit: /^(0|1)$/,
  number: /^-?([0-9]*)$/,
  alpha: /^[a-zA-z]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  alphaWithSpecial: '[a-zA-Z0-9\"\?\(\)\.\_\ \%\@\&\#\$\!,;:\-]+$',
  alphaWithSpecialCharMenuItem: '[a-zA-Z0-9]+[a-zA-Z0-9\\[\\]\\\\!\#\+\=\{\}\|\;\"\<\>\?\`\(\)\.\,\:\$\*\'\_\ \/\%\@\&\^\-]*$',
  email: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
  phone: /^([0-9]{3}( |-|.)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-|.)?([0-9]{3}( |-|.)?[0-9]{4}|[a-zA-Z0-9]{7})$/,
  cc: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
  zip: /^(([0-9]{5})|([0-9]{5}[-][0-9]{4}))$/,
  decimal: /^\d+\.\d{0,4}$/,
  currencyWithFourDecimalPlace: [
    /^\d+\.\d{4}$/,
    'This field should use format 0.0000'
  ],
  price: /^\$?\s?[0-9\,]+(\.\d{0,4})?$/,
  url: /(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
}).config(function ($localStorageProvider) {
  $localStorageProvider.setKeyPrefix('TS5-');
}).config(function ($httpProvider) {
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }

  $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get.Pragma = 'no-cache';

  $httpProvider.interceptors.push('defaultData');
  $httpProvider.interceptors.push('httpSessionInterceptor');
}).config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  }).when('/item-list', {
    templateUrl: 'views/item-list.html',
    controller: 'ItemListCtrl'
  }).when('/item-create', {
    templateUrl: 'views/item-create.html',
    controller: 'ItemCreateCtrl'
  }).when('/item-edit/:id', {
    templateUrl: 'views/item-create.html',
    controller: 'ItemCreateCtrl'
  }).when('/item-view/:id', {
    templateUrl: 'views/item-create.html',
    controller: 'ItemCreateCtrl'
  }).when('/item-copy/:id', {
    templateUrl: 'views/item-create.html',
    controller: 'ItemCreateCtrl'
  }).when('/category-list', {
    templateUrl: 'views/category-list.html',
    controller: 'CategoryListCtrl'
  }).when('/category/:id/:action', {
    templateUrl: 'views/category-create.html',
    controller: 'CategoryCreateCtrl'
  }).when('/category/:action', {
    templateUrl: 'views/category-create.html',
    controller: 'CategoryCreateCtrl'
  }).when('/stock-owner-item-list', {
    templateUrl: 'views/stock-owner-item-list.html',
    controller: 'StockOwnerItemListCtrl'
  }).when('/stock-owner-item-create', {
    templateUrl: 'views/stock-owner-item-create.html',
    controller: 'StockOwnerItemCreateCtrl'
  }).when('/stock-owner-item-edit/:id', {
    templateUrl: 'views/stock-owner-item-create.html',
    controller: 'StockOwnerItemCreateCtrl'
  }).when('/stock-owner-item-view/:id', {
    templateUrl: 'views/stock-owner-item-create.html',
    controller: 'StockOwnerItemCreateCtrl'
  }).when('/company-list', {
    templateUrl: 'views/company-list.html',
    controller: 'CompanyListCtrl'
  }).when('/company/:id', {
    templateUrl: 'views/company.html',
    controller: 'CompanyCtrl'
  }).when('/company-create', {
    templateUrl: 'views/company-create.html',
    controller: 'CompanyCreateCtrl'
  }).when('/company-edit/:id', {
    templateUrl: 'views/company-create.html',
    controller: 'CompanyCreateCtrl'
  }).when('/company-view/:id', {
    templateUrl: 'views/company-create.html',
    controller: 'CompanyCreateCtrl'
  }).when('/store-number', {
    templateUrl: 'views/store-number-create.html',
    controller: 'StoreNumberCreateCtrl'
  }).when('/company-relationship-list/:id', {
    templateUrl: 'views/company-relationship.html',
    controller: 'CompanyRelationshipListCtrl'
  }).when('/exchange-rates', {
    templateUrl: 'views/exchange-rates.html',
    controller: 'ExchangeRatesCtrl'
  }).when('/menu-list', {
    templateUrl: 'views/menu-list.html',
    controller: 'MenuListCtrl'
  }).when('/menu/:state/:id?', {
    templateUrl: 'views/menu-edit.html',
    controller: 'MenuEditCtrl'
  }).when('/cash-bag/:state/:id?', {
    templateUrl: 'views/cash-bag.html',
    controller: 'CashBagCtrl'
  }).when('/cash-bag-list', {
    templateUrl: 'views/cash-bag-list.html',
    controller: 'CashBagListCtrl'
  }).when('/cash-bag-submission', {
    templateUrl: 'views/cash-bag-submission.html',
    controller: 'CashBagSubmissionCtrl'
  }).when('/post-trip-data-list', {
    templateUrl: 'views/post-trip-data-list.html',
    controller: 'PostFlightDataListCtrl'
  }).when('/post-trip-data/:state/:id?', {
    templateUrl: 'views/post-trip-data.html',
    controller: 'PostFlightDataCtrl'
  }).when('/employee-commission/:state/:id?', {
    templateUrl: 'views/employee-commission-edit.html',
    controller: 'EmployeeCommissionEditCtrl'
  }).when('/global-reason-code', {
    templateUrl: 'views/global-reason-code.html',
    controller: 'GlobalReasonCodeCtrl'
  }).when('/company-reason-code', {
    templateUrl: 'views/company-reason-code.html',
    controller: 'CompanyReasonCodeCtrl'
  }).when('/menu-relationship-list', {
    templateUrl: 'views/menu-relationship-list.html',
    controller: 'MenuRelationshipListCtrl'
  }).when('/menu-relationship-create', {
    templateUrl: 'views/menu-relationship-create.html',
    controller: 'MenuRelationshipCreateCtrl'
  }).when('/menu-relationship-edit/:id', {
    templateUrl: 'views/menu-relationship-create.html',
    controller: 'MenuRelationshipCreateCtrl'
  }).when('/menu-relationship-view/:id', {
    templateUrl: 'views/menu-relationship-create.html',
    controller: 'MenuRelationshipCreateCtrl'
  }).when('/item-import', {
    templateUrl: 'views/item-import.html',
    controller: 'ItemImportCtrl'
  }).when('/lmp-locations-list', {
    templateUrl: 'views/lmp-locations-list.html',
    controller: 'ManageLmpLocationsCtrl'
  }).when('/manage-goods-received', {
    templateUrl: 'views/manage-goods-received.html',
    controller: 'ManageGoodsReceivedCtrl'
  }).when('/lmp-delivery-note/:state/:id?', {
    templateUrl: 'views/lmp-delivery-note.html',
    controller: 'LmpDeliveryNoteCtrl'
  }).when('/employee-commission-list', {
    templateUrl: 'views/employee-commission-list.html',
    controller: 'EmployeeCommissionListCtrl'
  }).when('/stock-dashboard', {
    templateUrl: 'views/stock-dashboard.html',
    controller: 'StockDashboardCtrl'
  }).when('/stock-take/:state/:id?', {
    templateUrl: 'views/stock-take.html',
    controller: 'StockTakeCtrl'
  }).when('/stock-take-review', {
    templateUrl: 'views/stock-take-review.html',
    controller: 'StockTakeReviewCtrl'
  }).when('/stock-take-report', {
    templateUrl: 'views/stock-take-report.html',
    controller: 'StockTakeReportCtrl'
  }).when('/commission-data-table', {
    templateUrl: 'views/commission-data-table.html',
    controller: 'CommissionDataTableCtrl'
  }).when('/commission-data/:state/:id?', {
    templateUrl: 'views/commission-data-create.html',
    controller: 'CommissionDataCtrl'
  }).when('/store-instance-step-1', {
    templateUrl: 'views/store-instance-step-1.html',
    controller: 'StoreInstanceStep1Ctrl'
  }).when('/store-instance-create/:action/:storeId?', {
    templateUrl: 'views/store-instance-create.html',
    controller: 'StoreInstanceCreateCtrl'
  }).when('/store-instance-packing/:action/:storeId', {
    templateUrl: 'views/store-instance-packing.html',
    controller: 'StoreInstancePackingCtrl'
  }).when('/store-instance-seals/:action/:storeId', {
    templateUrl: 'views/store-instance-seals.html',
    controller: 'StoreInstanceSealsCtrl'
  }).when('/store-instance-inbound-seals/:action/:storeId', {
    templateUrl: 'views/store-instance-seals.html',
    controller: 'StoreInstanceSealsCtrl'
  }).when('/retail-company-exchange-rate-setup', {
    templateUrl: 'views/retail-company-exchange-rate-setup.html',
    controller: 'RetailCompanyExchangeRateSetupCtrl'
  }).when('/store-instance-review/:action/:storeId?', {
    templateUrl: function (routeParameters) {
      if (routeParameters.action === 'redispatch') {
        return 'views/store-instance-redispatch-review.html';
      }

      return 'views/store-instance-review.html';
    },

    controller: 'StoreInstanceReviewCtrl'
  }).when('/store-instance-dashboard', {
    templateUrl: 'views/store-instance-dashboard.html',
    controller: 'StoreInstanceDashboardCtrl'
  }).when('/promotions/:state/:id?', {
    templateUrl: 'views/promotions.html',
    controller: 'PromotionsCtrl'
  }).when('/manual-store-instance', {
    templateUrl: 'views/manual-store-instance.html',
    controller: 'ManualStoreInstanceCtrl'
  }).when('/retail-company-exchange-rate-setup', {
    templateUrl: 'views/retail-company-exchange-rate-setup.html',
    controller: 'RetailCompanyExchangeRateSetupCtrl'
  }).when('/discounts', {
    templateUrl: 'views/discount-list.html',
    controller: 'DiscountListCtrl',
  }).when('/currency-edit', {
    templateUrl: 'views/currency-edit.html',
    controller: 'CurrencyEditCtrl',
  }).when('/company-exchange-rate-edit', {
    templateUrl: 'views/company-exchange-rate-edit.html',
    controller: 'CompanyExchangeRateEditCtrl',
  }).when('/reconciliation-discrepancy-detail/:storeInstanceId', {
    templateUrl: 'views/reconciliation-discrepancy-detail.html',
    controller: 'ReconciliationDiscrepancyDetail'
  }).when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginCtrl'
  }).when('/change-password', {
    templateUrl: 'views/change-password.html',
    controller: 'ChangePasswordCtrl'
  }).when('/forgot-username-password', {
    templateUrl: 'views/forgot-username-password.html',
    controller: 'ForgotUsernamePasswordCtrl'
  }).when('/reconciliation-dashboard', {
    templateUrl: 'views/reconciliation-dashboard.html',
    controller: 'ReconciliationDashboardCtrl'
  }).when('/store-instance-amend/:storeInstanceId', {
    templateUrl: 'views/store-instance-amend.html',
    controller: 'StoreInstanceAmendCtrl'
  }).when('/station-list', {
    templateUrl: 'views/station-list.html',
    controller: 'StationListCtrl'
  }).when('/station-create', {
    templateUrl: 'views/station-create.html',
    controller: 'StationCreateCtrl'
  }).when('/station-edit/:id', {
    templateUrl: 'views/station-create.html',
    controller: 'StationCreateCtrl'
  }).when('/station-view/:id', {
    templateUrl: 'views/station-create.html',
    controller: 'StationCreateCtrl'
  }).when('/tax-rates', {
    templateUrl: 'views/tax-rates.html',
    controller: 'TaxRatesCtrl',
  }).when('/company-reason-type-subscribe', {
    templateUrl: 'views/company-reason-type-subscribe.html',
    controller: 'CompanyReasonTypeSubscribeCtrl'
  }).when('/employee-messages', {
    templateUrl: 'views/employee-message-list.html',
    controller: 'EmployeeMessageListCtrl'
  }).when('/employee-message/:action/:id?', {
    templateUrl: 'views/employee-message.html',
    controller: 'EmployeeMessageCtrl'
  }).when('/discounts/create', {
    templateUrl: 'views/discount-create.html',
    controller: 'DiscountCreateCtrl'
  }).when('/discounts/edit/:id', {
    templateUrl: 'views/discount-create.html',
    controller: 'DiscountCreateCtrl'
  }).when('/promotions', {
    templateUrl: 'views/promotion-list.html',
    controller: 'PromotionListCtrl'
  }).when('/excise-duty-list', {
    templateUrl: 'views/excise-duty-list.html',
    controller: 'ExciseDutyListCtrl'
  }).when('/excise-duty-relationship-list', {
    templateUrl: 'views/excise-duty-relationship-list.html',
    controller: 'ExciseDutyRelationshipListCtrl'
  }).when('/transactions', {
    templateUrl: 'views/transaction-list.html',
    controller: 'TransactionListCtrl'
  }).when('/manual-ecs', {
    templateUrl: 'views/manual-ECS.html',
    controller: 'ManualECSCtrl'
  }).when('/manual-epos-dashboard/:cashBagId', {
    templateUrl: 'views/manual-epos-entry.html',
    controller: 'ManualEposEntryCtrl'
  }).when('/manual-epos-cash/:cashBagId', {
    templateUrl: 'views/manual-epos-cash.html',
    controller: 'ManualEposCashCtrl'
  }).when('/manual-epos-credit/:cashBagId', {
    templateUrl: 'views/manual-epos-credit.html',
    controller: 'ManualEposCreditCtrl'
  }).when('/manual-epos-items/:itemType/:cashBagId', {
    templateUrl: 'views/manual-epos-items.html',
    controller: 'ManualEposItemsCtrl'
  }).when('/manual-epos-discount/:cashBagId', {
    templateUrl: 'views/manual-epos-discount.html',
    controller: 'ManualEposDiscountCtrl'
  }).when('/manual-epos-promotion/:cashbagId', {
    templateUrl: 'views/manual-epos-promotion.html',
    controller: 'ManualEposPromotionCtrl'
  }).when('/reports', {
    templateUrl: 'views/reports.html',
    controller: 'ReportsCtrl',
    controllerAs: 'reports'
  }).when('/reports/queue', {
    templateUrl: 'views/queue.html',
    controller: 'QueueCtrl',
    controllerAs: 'queue'
  }).when('/reports/scheduled-reports', {
    templateUrl: 'views/scheduled-reports.html',
    controller: 'ScheduledReportsCtrl',
    controllerAs: 'scheduledReports'
  }).when('/promotion-category-list', {
    templateUrl: 'views/promotion-category-list.html',
    controller: 'PromotionCategoryListCtrl'
  }).when('/promotion-category/:action/:id?', {
    templateUrl: 'views/promotion-category.html',
    controller: 'PromotionCategoryCtrl'
  }).when('/promotion-catalog-list', {
    templateUrl: 'views/promotion-catalog-list.html',
    controller: 'PromotionCatalogListCtrl'
  }).when('/promotion-catalog/:action/:id?', {
    templateUrl: 'views/promotion-catalog.html',
    controller: 'PromotionCatalogCtrl'
  }).when('/promotion-catalog-conjunction/:action/:id', {
    templateUrl: 'views/promotion-catalog-conjunction.html',
    controller: 'PromotionCatalogConjunctionCtrl'
  }).when('/epos-transaction-list', {
    templateUrl: 'views/epos-transaction-list.html',
    controller: 'EposTransactionListCtrl',
  }).when('/schedules', {
    templateUrl: 'views/schedule-list.html',
    controller: 'ScheduleListCtrl',
    controllerAs: 'scheduleList'
  }).otherwise({
    redirectTo: '/'
  });
}).run(function ($rootScope, regexp) {
  $rootScope.regexp = regexp;
});
