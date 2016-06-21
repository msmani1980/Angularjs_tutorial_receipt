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
        '/cash-bag-submission/*',
        '/cash-bag$/*',
        '/change-password/*',
        '/commission-data-table/*',
        '/commission-data/*',
        '/company-create/*',
        '/company-edit/*',
        '/company-exchange-rate-edit/*',
        '/company-list/*',
        '/company-reason-code/*',
        '/company-reason-type-subscribe/*',
        '/company-relationship-list/*',
        '/company-view/*',
        '/company/*',
        '/currency-edit/*',
        '/discounts/*',
        '/employee-commission-list/*',
        '/employee-commission/*',
        '/employee-message/*',
        '/employee-messages/*',
        '/exchange-rates/*',
        '/forgot-username-password/*',
        '/global-reason-code/*',
        '/item-copy/*',
        '/item-create/*',
        '/item-edit/*',
        '/item-import/*',
        '/item-view/*',
        '/lmp-delivery-note/*',
        '/lmp-locations-list/*',
        '/login',
        '/manage-goods-received/*',
        '/manual-epos-cash/*',
        '/manual-epos-credit/*',
        '/manual-epos-dashboard/*',
        '/manual-epos-discount/*',
        '/manual-epos-items/*',
        '/manual-store-instance/*',
        '/menu-list/*',
        '/menu-relationship-create/*',
        '/menu-relationship-edit/*',
        '/menu-relationship-list/*',
        '/menu-relationship-view/*',
        '/menu/*',
        '/promotions/*',
        '/retail-company-exchange-rate-setup/*',
        '/station-create/*',
        '/station-edit/*',
        '/station-list/*',
        '/station-view/*',
        '/stock-dashboard/*',
        '/stock-owner-item-create/*',
        '/stock-owner-item-edit/*',
        '/stock-owner-item-view/*',
        '/stock-take-report/*',
        '/stock-take-review/*',
        '/stock-take/*',
        '/store-instance-create/*',
        '/store-instance-dashboard/*',
        '/store-instance-inbound-seals/*',
        '/store-instance-packing/*',
        '/store-instance-seals/*',
        '/store-instance-review/*',
        '/store-instance-step-1/*',
        '/store-number/*',
        '/tax-rates/*',
        '/transactions/*',
        '/ember/#/schedules/*',
        '/ember/#/menu-assignments/*',
        '/ember/#/menu-rules/*',
        '/ember/#/promotion-categories/*',
        '/ember/#/promotion-catalogs/*',
        '/ember/#/receipt-rules/*'
    ];

    var legacyApis = [
        '/rsvr/api/company-preferences',
        '/rsvr/api/companies/[0-9]*/relationships',
        'rsvr/api/records/store-status',
        '/rsvr/api/caterer-stations',
        '/rsvr/api/companies/[0-9]*$',
        '/rsvr/api/retail-items/master/*',
        '/rsvr/api/daily-exchange-rates/[0-9]*',
        '/rsvr/api/units',
        '/rsvr/api/cash-bags/[0-9]*$',
        '/rsvr/api/promotions/[0-9]*$',
        '/rsvr/api/dispatch/store-instances/[0-9]*/status/[0-9]*$',
        '/rsvr/api/company-currency-globals',
        '/rsvr/api/promotions',
        '/rsvr/api/companies/stores/[0-9]*',
        '/rsvr/api/records/company-types'
    ];

    var onlyRsvrApis = [
      '/rsvr/api/dailyexchangerate',
      '/rsvr/api/company-formats',
      '/rsvr/api/companies/[0-9]*/stations',
      '/rsvr/api/store-instances/[0-9]*/calculated-inbounds',
      '/rsvr/api/cashbags/[0-9]*',
      '/rsvr/api/cashbag/[0-9]+/cash',
      '/rsvr/api/cashbags/cash/',
      '/rsvr/api/cashbag-[a-z]+(/[0-9]*)?'
    ];

    function responseError(response) {

      if (errorCodeMap[response.status]) {
        $rootScope.$broadcast(errorCodeMap[response.status]);
      }

      return $q.reject(response);
    }

    var isMatching = function(url, list) {
      var matches = Array.prototype.filter.call(list, function (item) {
        return url.match(item);
      });

      return matches.length !== 0;
    };

    var isPageWithLegacyAPIs = function() {
      return isMatching($location.absUrl(), notrsvrPages);
    };

    var isLegacyAPI = function(config) {
      return isMatching(config.url, legacyApis);
    };

    var isOnlyRsvrAPI = function(url) {
      return isMatching(url, onlyRsvrApis);
    };

    var shouldReplaceUrl = function(config) {
      var hasRestParam = $location.absUrl().indexOf('api=rest') > 0;

      if (hasRestParam) {
        return false;
      }

      if (isOnlyRsvrAPI(config.url)) {
        return false;
      }

      if (isPageWithLegacyAPIs() || isLegacyAPI(config)) {
        return true;
      }

      return false;
    };

    function request(config) {
      var isNotTemplateRequest = config.url.match(/html$/) === null;

      if (isNotTemplateRequest && shouldReplaceUrl(config)) {
        config.url = config.url.replace('/rsvr/api', '/api');
      }

      return config || $q.when(config);
    }

    return {
      responseError: responseError,
      request: request
    };

  });
