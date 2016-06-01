'use strict';

/**
 * @ngdoc service
 * @name ts5App.httpSessionInterceptor
 * @description
 * # httpSessionInterceptor
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('httpSessionInterceptor', function ($rootScope, $q, $location) {

    var errorCodeMap = {
      401: 'unauthorized',
      404: 'http-response-error',
      500: 'http-response-error'
    };

    var notrsvrPages = [
        '/cash-bag-list',
        '/cash-bag-submission',
        '/cash-bag/:state/[0-9]*',
        '/category-list',
        '/category/:action',
        '/category/:id/:action',
        '/change-password', 
        '/commission-data-table',
        '/commission-data/:state/[0-9]*',
        '/company-create',
        '/company-edit/:id',
        '/company-exchange-rate-edit',
        '/company-list',
        '/company-reason-code',
        '/company-reason-type-subscribe',
        '/company-relationship-list/:id',
        '/company-view/[0-9]*',
        '/company/[0-9]*',
        '/currency-edit',
        '/discounts',
        '/discounts/create',
        '/discounts/edit/[0-9]*',
        '/employee-commission-list',
        '/employee-commission/[a-z]*/[0-9]*',
        '/employee-message/[a-z]*/[0-9]*',
        '/employee-messages',
        '/exchange-rates',
        '/excise-duty-list',
        '/excise-duty-relationship-list',
        '/forgot-username-password', 
        '/global-reason-code',
        '/item-copy/[0-9]*',
        '/item-create',
        '/item-edit/[0-9]*',
        '/item-import',
        '/item-list',
        '/item-view/[0-9]*',
        '/lmp-delivery-note/:state/[0-9]*',
        '/lmp-locations-list',
        '/login',
        '/manage-goods-received',
        '/manual-ecs',
        '/manual-epos-cash/:cashBagId',
        '/manual-epos-credit/:cashBagId',
        '/manual-epos-dashboard/:cashBagId',
        '/manual-epos-discount/:cashBagId',
        '/manual-epos-items/:itemType/:cashBagId',
        '/manual-store-instance', 
        '/menu-list',
        '/menu-relationship-create',
        '/menu-relationship-edit/[0-9]*',
        '/menu-relationship-list',
        '/menu-relationship-view/[0-9]*',
        '/menu/:state/[0-9]*',
        '/post-trip-data-list',
        '/post-trip-data/:state/[0-9]*',
        '/promotions',
        '/promotions/:state/[0-9]*',
        '/reconciliation-dashboard',
        '/reconciliation-discrepancy-detail/:storeInstanceId',
        '/retail-company-exchange-rate-setup',
        '/retail-company-exchange-rate-setup',
        '/station-create', 
        '/station-edit/[0-9]*', 
        '/station-list',
        '/station-view/[0-9]*',
        '/stock-dashboard',
        '/stock-owner-item-create',
        '/stock-owner-item-edit/[0-9]*',
        '/stock-owner-item-list',
        '/stock-owner-item-view/[0-9]*',
        '/stock-take-report',
        '/stock-take-review', 
        '/stock-take/:state/[0-9]*',
        '/store-instance-amend/:storeInstanceId',
        '/store-instance-create/:action/:storeId?',
        '/store-instance-dashboard',
        '/store-instance-inbound-seals/:action/:storeId',
        '/store-instance-packing/:action/:storeId',
        '/store-instance-seals/:action/:storeId',
        '/store-instance-review/:action/:storeId?',
        '/store-instance-step-1',
        '/store-number',
        '/tax-rates',
        '/transactions'
    ];

    function responseError(response) {

      if (errorCodeMap[response.status]) {
        $rootScope.$broadcast(errorCodeMap[response.status]);
      }

      return $q.reject(response);
    }

    function request(config) {

      if (!config.url.match(/html$/)) {
        var matches = Array.prototype.filter.call(notrsvrPages, function (page) {
          return $location.absUrl().match(page);
        });

        if (matches && $location.absUrl().indexOf('api=rest') <= 0) {
          config.url = config.url.replace('/rsvr/api', '/api');
        }

      }

      return config || $q.when(config);
    }

    return {
      responseError: responseError,
      request: request
    };

  });
