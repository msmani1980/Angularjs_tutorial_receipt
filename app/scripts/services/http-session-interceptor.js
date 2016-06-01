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
        '/cash-bag/*',
        '/category-list',
        '/category/*',
        '/change-password', 
        '/commission-data-table',
        '/commission-data/*',
        '/company-create',
        '/company-edit/*',
        '/company-exchange-rate-edit',
        '/company-list',
        '/company-reason-code',
        '/company-reason-type-subscribe',
        '/company-relationship-list/*',
        '/company-view/*',
        '/company/*',
        '/currency-edit',
        '/discounts',
        '/discounts/*',
        '/employee-commission-list',
        '/employee-commission/*',
        '/employee-message/*',
        '/employee-messages',
        '/exchange-rates',
        '/excise-duty-list',
        '/excise-duty-relationship-list',
        '/forgot-username-password', 
        '/global-reason-code',
        '/item-copy/*',
        '/item-create',
        '/item-edit/*',
        '/item-import',
        '/item-list',
        '/item-view/*',
        '/lmp-delivery-note/*',
        '/lmp-locations-list',
        '/login',
        '/manage-goods-received',
        '/manual-ecs',
        '/manual-epos-cash/*',
        '/manual-epos-credit/*',
        '/manual-epos-dashboard/*',
        '/manual-epos-discount/*',
        '/manual-epos-items/*',
        '/manual-store-instance', 
        '/menu-list',
        '/menu-relationship-create',
        '/menu-relationship-edit/*',
        '/menu-relationship-list',
        '/menu-relationship-view/*',
        '/menu/:state/*',
        '/post-trip-data-list',
        '/post-trip-data/*',
        '/promotions',
        '/promotions/*',
        '/retail-company-exchange-rate-setup',
        '/station-create',
        '/station-edit/*',
        '/station-list',
        '/station-view/*',
        '/stock-dashboard',
        '/stock-owner-item-create',
        '/stock-owner-item-edit/*',
        '/stock-owner-item-list',
        '/stock-owner-item-view/*',
        '/stock-take-report',
        '/stock-take-review',
        '/stock-take/*',
        '/store-instance-amend/*',
        '/store-instance-create/*',
        '/store-instance-dashboard',
        '/store-instance-inbound-seals/*',
        '/store-instance-packing/*',
        '/store-instance-seals/*',
        '/store-instance-review/*',
        '/store-instance-step-1',
        '/store-number',
        '/tax-rates',
        '/transactions',
        '/ember/#/schedules',
        '/ember/#/menu-assignments',
        '/ember/#/menu-rules',
        '/ember/#/menu-rules/create',
        '/ember/#/promotion-categories',
        '/ember/#/promotion-catalogs',
        '/ember/#/receipt-rules',
        '/ember/#/receipt-rules/create'
    ];

    var legacyApis = [
        '/rsvr/api/company-preferences'
    ];

    function responseError(response) {

      if (errorCodeMap[response.status]) {
        $rootScope.$broadcast(errorCodeMap[response.status]);
      }

      return $q.reject(response);
    }

    function request(config) {
      var isNotTemplateRequest = config.url.match(/html$/) === null;

      if (isNotTemplateRequest && shouldReplaceUrl(config)) {
        config.url = config.url.replace('/rsvr/api', '/api');
        return config || $q.when(config);
      }

      return config || $q.when(config);
    }

    var isPageWithLegacyAPIs = function() {
      var pageMatches = Array.prototype.filter.call(notrsvrPages, function (page) {
        return $location.absUrl().match(page);
      });

      return pageMatches.length > 0;
    };

    var isLegacyAPI = function(config) {
      var apiMatches =  Array.prototype.filter.call(legacyApis, function (api) {
        return config.url.match(api);
      });

      return apiMatches.length !== 0;
    };

    var shouldReplaceUrl = function(config) {
      var hasRestParam = $location.absUrl().indexOf('api=rest') > 0;
      if (!hasRestParam && isPageWithLegacyAPIs() || isLegacyAPI(config)) {
        return true;
      }

      return false;
    };

    return {
      responseError: responseError,
      request: request
    };

  });
