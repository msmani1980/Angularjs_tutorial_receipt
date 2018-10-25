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
  percentage: /^[-+]?([0-9]\d?(\.\d{1,3})?|0\.(\d?[1-9]|[1-9]\d))$|^100$|^100.00$/,
  currencyWithFourDecimalPlace: [
    /^\d+\.\d{4}$/,
    'This field should use format 0.0000'
  ],
  price: /^\$?\s?[0-9\,]+(\.\d{0,4})?$/,
  url: /(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/,
  t24: /^([01]\d|2[0-3]):([0-5]\d)$/,
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
  }).when('/reconciliation-discrepancy-detail/view/:storeInstanceId', {
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
  }).when('/reconciliation-cash-bag-list', {
    templateUrl: 'views/reconciliation-cash-bag-list.html',
    controller: 'ReconciliationCashBagListCtrl'
  }).when('/reconciliation-cash-bag/view/:id?', {
    templateUrl: 'views/reconciliation-cash-bag.html',
    controller: 'ReconciliationCashBagCtrl'
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
  }).when('/discounts/:state/:id', {
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
  }).when('/schedules/:action/:id?', {
    templateUrl: 'views/schedule.html',
    controller: 'ScheduleCtrl',
    controllerAs: 'schedule'
  }).when('/receipt-rules', {
    templateUrl: 'views/receipt-rules.html',
    controller: 'ReceiptRulesCtrl',
    controllerAs: 'receiptRules'
  }).when('/receipt-rules/:action/:id?', {
    templateUrl: 'views/receipt-rules-create.html',
    controller: 'ReceiptRulesCreateCtrl',
    controllerAs: 'receiptRulesCreate'
  }).when('/employees', {
    templateUrl: 'views/employee-list.html',
    controller: 'EmployeeListCtrl',
    controllerAs: 'employeeList'
  }).when('/employee/:action/:id?', {
    templateUrl: 'views/employee.html',
    controller: 'EmployeeCtrl',
    controllerAs: 'employee'
  }).when('/menu-assignment/:action/:id?', {
    templateUrl: 'views/menu-assignment.html',
    controller: 'MenuAssignmentCtrl',
    controllerAs: 'menuAssignment'
  }).when('/menu-assignment-list', {
    templateUrl: 'views/menu-assignment-list.html',
    controller: 'MenuAssignmentListCtrl',
    controllerAs: 'menuAssignmentList'
  }).when('/menu-rules', {
    templateUrl: 'views/menu-rules.html',
    controller: 'MenuRulesCtrl',
    controllerAs: 'menuRules'
  }).when('/menu-rules/:action/:id?', {
    templateUrl: 'views/menu-rule-create.html',
    controller: 'MenuRuleCreateCtrl',
    controllerAs: 'menuRuleCreate'
  }).when('/survey', {
    templateUrl: 'views/survey.html',
    controller: 'SurveyCtrl',
    controllerAs: 'survey'
  }).when('/survey/:action/:id?', {
    templateUrl: 'views/survey-create.html',
    controller: 'SurveyCreateCtrl',
    controllerAs: 'surveyCreate'
  }).when('/survey-catalog', {
    templateUrl: 'views/survey-catalog.html',
    controller: 'SurveyCatalogCtrl',
    controllerAs: 'surveyCatalog'
  }).when('/survey-catalog/:action/:id?', {
    templateUrl: 'views/survey-catalog-create.html',
    controller: 'SurveyCatalogCreateCtrl',
    controllerAs: 'surveyCatalogCreate'
  }).when('/survey-questions', {
    templateUrl: 'views/survey-questions-list.html',
    controller: 'SurveyQuestionsListCtrl',
    controllerAs: 'surveyQuestionsList'
  }).when('/survey-questions/:action/:id?', {
    templateUrl: 'views/survey-questions-create.html',
    controller: 'SurveyQuestionsCreateCtrl',
    controllerAs: 'surveyQuestionsCreate'
  }).when('/company-reasoncodes-list', {
    templateUrl: 'views/company-reasoncodes-list.html',
    controller: 'CompanyReasoncodesListCtrl',
    controllerAs: 'companyReasoncodesList'
  }).when('/epos-config', {
    templateUrl: 'views/epos-config.html',
    controller: 'EposConfigCtrl',
    controllerAs: 'eposConfig'
  }).when('/back-office-config', {
    templateUrl: 'views/back-office-config.html',
    controller: 'BackOfficeConfigCtrl',
    controllerAs: 'backOfficeConfig'
  }).when('/report-exchange-rate', {
    templateUrl: 'views/report-exchange-rate.html',
    controller: 'ReportExchangeRateCtrl',
    controllerAs: 'reportExchangeRate'
  }).when('/priceupdater-list', {
    templateUrl: 'views/priceupdater-list.html',
    controller: 'PriceupdaterListCtrl',
    controllerAs: 'priceupdaterList'
  }).when('/priceupdater/:action/:id?', {
    templateUrl: 'views/priceupdater-create.html',
    controller: 'PriceupdaterCreateCtrl',
    controllerAs: 'priceupdaterCreate'
  }).when('/company-receipts/:action/:id?', {
    templateUrl: 'views/company-receipt-create.html',
    controller: 'CompanyReceiptCreateCtrl',
    controllerAs: 'companyReceiptCreate'
  }).when('/company-receipts', {
    templateUrl: 'views/company-receipt-list.html',
    controller: 'CompanyReceiptListCtrl',
    controllerAs: 'companyReceiptList'
  }).when('/company-email-receipts', {
    templateUrl: 'views/company-email-receipt-list.html',
    controller: 'CompanyEmailReceiptListCtrl',
    controllerAs: 'companyEmailReceiptList'
  }).when('/company-email-receipts/:action/:id?', {
    templateUrl: 'views/company-email-receipt-create.html',
    controller: 'CompanyEmailReceiptCreateCtrl',
    controllerAs: 'companyEmailReceiptCreate'
  }).when('/route-tax-rates', {
    templateUrl: 'views/route-tax-rates.html',
    controller: 'RouteTaxRatesCtrl',
    controllerAs: 'routeTaxRates'
  }).when('/user-list', {
    templateUrl: 'views/user-list.html',
    controller: 'UserManagementListCtrl'
  }).when('/user-create', {
    templateUrl: 'views/user-create.html',
    controller: 'UserCreateCtrl'
  }).when('/user-edit/:user', {
    templateUrl: 'views/user-create.html',
    controller: 'UserCreateCtrl'
  }).when('/user-view/:user', {
    templateUrl: 'views/user-create.html',
    controller: 'UserCreateCtrl'
  }).otherwise({
    redirectTo: '/'
  });
}).run(function ($rootScope, regexp) {
  $rootScope.regexp = regexp;
}).run(function ($rootScope, $location, $localStorage, mainMenuService, messageService, _) {
  $rootScope.$on('$locationChangeStart', function(event) {
    var menu = mainMenuService.getMenu();
    var userFeaturesInRole = $localStorage.featuresInRole;

    _.forEach(menu, function(item) {
      _.forEach(item.menuItems, function(menuItem) {
        if (userFeaturesInRole && menuItem.package === 'EPOSCONFIG') { // Enabled just for 'EPOSCONFIG' for TSVPORTAL-231 for now
          var fullUrl = $location.absUrl();
          var featureRoleByPackage = userFeaturesInRole[menuItem.package];

          if (!featureRoleByPackage && fullUrl && fullUrl.match(menuItem.route)) {
            event.preventDefault();
            messageService.display('danger', 'You do not have permissions to access this page.');
          }
        }
      });
    });
  });
});
