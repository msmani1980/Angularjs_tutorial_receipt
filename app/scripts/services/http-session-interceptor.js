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
      '/forgot-username-password/*',
      '/global-reason-code/*',
      '/lmp-locations-list/*',
      '/login',
      '/manual-epos-cash/*',
      '/manual-epos-credit/*',
      '/manual-epos-dashboard/*',
      '/manual-epos-discount/*',
      '/manual-epos-items/*',
      '/manual-store-instance/*',
      '/retail-company-exchange-rate-setup/*',
      '/station-create/*',
      '/station-edit/*',
      '/station-list/*',
      '/station-view/*',
      '/store-instance-step-1/*',
      '/tax-rates/*',
      '/ember/#/schedules/*',
      '/ember/#/menu-assignments/*',
      '/ember/#/menu-rules/*',
      '/ember/#/promotion-catalogs/*',
      '/ember/#/receipt-rules/*',
      '/promotion-catalog-list/*',
      '/promotion-catalog/*',
      '/promotion-catalog-conjunction/*'
    ];

    var legacyApis = [
      '/rsvr/api/dispatch/store-instances/[0-9]*/status/[9-9][^11]*$',
      '/rsvr/api/companies/[0-9]*/company-credit-card-types',
      '/rsvr/api/company-discounts/[0-9]*$'
    ];

    var onlyRsvrApis = [
      '/rsvr/api/eula',
      '/rsvr/api/company-preferences',
      '/rsvr/api/currencies',
      '/rsvr/api/dailyexchangerate',
      '/rsvr/api/company-formats',
      '/rsvr/api/companies/[0-9]*/stations',
      '/rsvr/api/store-instances/[0-9]*/calculated-inbounds',
      '/rsvr/api/cashbags/[0-9]*',
      '/rsvr/api/cashbag/[0-9]+/cash',
      '/rsvr/api/cashbags/cash/',
      '/rsvr/api/cashbag-[a-z]+(/[0-9]*)?',
      '/rsvr/api/dispatch/store-instances/[0-9]*/status/11',
      '/rsvr/api/companies/[0-9]*/relationships',
      '/rsvr/api/company-currency-globals',
      '/rsvr/api/companies/stores',
      '/rsvr/api/companies/time-configuration',
      '/rsvr/api/feature/DAILYEXCHANGERATE/thresholds',
      '/api/dispatch/store-instances/[0-9]*/menu-items',
      '/api/dispatch/store-instances/[0-9]*/items',
      '/api/dispatch/store-instances/[0-9]*/status/[0-4]',
      '/api/companies/[0-9]*/posttrips',
      '/api/companies/[0-9]*/posttrips/[0-9]*',
      '/api/companies/[0-9]*/sales-categories',
      '/rsvr/api/retail-items/master/*',
      '/rsvr/api/menus/menu-masters',
      '/rsvr/api/menus/caterer-stations',
      '/rsvr/api/caterer-stations',
      '/rsvr/api/menus'
    ];

    function responseError(response) {

      if (errorCodeMap[response.status]) {
        $rootScope.$broadcast(errorCodeMap[response.status]);
      }

      return $q.reject(response);
    }

    var isMatching = function (url, list) {
      var matches = Array.prototype.filter.call(list, function (item) {
        return url.match(item);
      });

      return matches.length !== 0;
    };

    var isPageWithLegacyAPIs = function () {
      return isMatching($location.absUrl(), notrsvrPages);
    };

    var isLegacyAPI = function (config) {
      return isMatching(config.url, legacyApis);
    };

    var isOnlyRsvrAPI = function (url) {
      return isMatching(url, onlyRsvrApis);
    };

    var shouldReplaceUrl = function (config) {
      var hasRestParam = $location.absUrl().indexOf('api=rest') > 0;

      if (hasRestParam) {
        return false;
      }

      if (isOnlyRsvrAPI(config.url)) {
        return false;
      }

      return isPageWithLegacyAPIs() || isLegacyAPI(config);

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
