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

    var expressAPI =
    {
      apiList:
      [
        '/IdentityAccess/authorizeUser',
        '/api/[0-9]*/thresholds',
        '/api/cash-bags/submit',
        '/api/caterer-stations',
        '/api/caterer-stations/[0-9]*/menu-items',
        '/api/companies',
        '/api/companies/[0-9]*/cabin-classes',
        '/api/companies/[0-9]*/carrier-types',
        '/api/companies/[0-9]*/carrier-types/[0-9]*/carrier-numbers',
        '/api/companies/[0-9]*/carrier-types/[0-9]*/carrier-numbers/[0-9]*',
        '/api/companies/[0-9]*/carrier-types/[0-9]*/seat-configs',
        '/api/companies/[0-9]*/company-credit-card-types',
        '/api/companies/[0-9]*/currencies',
        '/api/companies/[0-9]*/employees',
        '/api/companies/[0-9]*/employees/distinct',
        '/api/companies/[0-9]*/posttrips',
        '/api/companies/[0-9]*/posttrips/[0-9]*',
        '/api/companies/[0-9]*/sales-categories', 
        '/api/companies/[0-9]*/sales-categories/[0-9]*',
        '/api/companies/[0-9]*/schedules',
        '/api/companies/[0-9]*/schedules/[0-9]*',
        '/api/companies/[0-9]*/schedules/distinct',
        '/api/companies/[0-9]*/stations',
        '/api/companies/[0-9]*/tax-rates',
        '/api/companies/[0-9]*/tax-rates/[0-9]*',
        '/api/companies/[0-9]*/tax-types',
        '/api/companies/[0-9]*/relationships',
        '/api/companies/[0-9]*',
        '/api/companies/[0-9]*/relationships',
        '/api/companies/[0-9]*/currencies',
        '/api/companies/[0-9]*/currencies/[0-9]*',
        '/api/companies/[0-9]*/stations',
        '/api/companies/stations',
        '/api/companies/stores',
        '/api/companies/stores/[0-9]*',
        '/api/companies/time-configuration',
        '/api/company-currency-globals',
        '/api/company-discounts',
        '/api/company-discounts/[0-9]*',
        '/api/company-preferences',
        '/api/company-promotion-catalogs',
        '/api/company-promotion-catalogs/[0-9]*',
        '/api/company-reason-codes',
        '/api/company-relation/[0-9]*/types',
        '/api/company-relation/[0-9]*/types',
        '/api/company-station-globals',
        '/api/countries',
        '/api/currencies',
        '/api/daily-exchange-rates',
        '/api/daily-exchange-rates/previous-exchange-rate',
        '/api/discounts',
        '/api/dispatch/store-instances',
        '/api/dispatch/store-instances/[0-9]*',
        '/api/dispatch/store-instances/[0-9]*/items',
        '/api/dispatch/store-instances/[0-9]*/items/bulk',
        '/api/dispatch/store-instances/[0-9]*/menu-items',
        '/api/dispatch/store-instances/[0-9]*/status/[0-9]*',
        '/api/dispatch/store-instances/[0-9]*/status',
        '/api/dispatch/store-instances/documents/*.pdf',
        '/api/employee-commissions',
        '/api/employee-commissions-payable',
        '/api/employee-commissions-payable/[0-9]*',
        '/api/employee-commissions/[0-9]*',
        '/api/employee-messages',
        '/api/employee-messages/[0-9]*',
        '/api/feature/STOREDISPATCH/thresholds',
        '/api/item-types',
        '/api/languages',
        '/api/menu-assignments',
        '/api/menu-assignments/[0-9]*',
        '/api/menu-rules',
        '/api/menu-rules/[0-9]*',
        '/api/menus',
        '/api/menus/[0-9]*',
        '/api/menus/caterer-stations',
        '/api/menus/caterer-stations/[0-9]*',
        '/api/menus/menu-masters',
        '/api/promotion-categories',
        '/api/promotion-categories/[0-9]*',
        '/api/promotions',
        '/api/promotions/[0-9]*',
        '/api/receipt-rules',
        '/api/receipt-rules/[0-9]*',
        '/api/reconciliation/promotion-totals',
        '/api/records/benefit-types',
        '/api/records/characteristics',
        '/api/records/commission-payable-types',
        '/api/records/company-types',
        '/api/records/count-types',
        '/api/records/crew-base-types',
        '/api/records/discount-apply-types',
        '/api/records/discount-types',
        '/api/records/features',
        '/api/records/item-types',
        '/api/records/price-types',
        '/api/records/promotion-types',
        '/api/records/seal-types',
        '/api/records/stations',
        '/api/records/store-status',
        '/api/records/tax-rate-types',
        '/api/retail-items',
        '/api/retail-items/import',
        '/api/retail-items/master',
        '/api/seal/colors',
        '/api/stations/',
        '/api/stations/[0-9]*',
        '/api/stock-management/dashboard',
        '/api/stock-management/dashboard/[0-9]*/file/export',
        '/api/stock-management/delivery-notes',
        '/api/stock-management/delivery-notes/[0-9]*',
        '/api/stock-management/station-items',
        '/api/stock-management/stock-takes',
        '/api/stock-management/stock-takes/[0-9]*', 
        '/api/store-instances/[0-9]*/seals',
        '/api/units',
        '/api/records/item-types'
      ]
    };

    function responseError(response) {

      if (errorCodeMap[response.status]) {
        $rootScope.$broadcast(errorCodeMap[response.status]);
      }

      return $q.reject(response);
    }

    function request(config) {

      var apis = expressAPI.apiList;
      if (!config.url.match(/html$/)) {

        var matches = Array.prototype.filter.call(apis, function (api) {
          return config.url.match(api);
        });

        if (matches.length === 0 || $location.absUrl().indexOf('api=rest') > 0) {
          config.url = config.url.replace('/api', '/rsvr/api');
        }

      }

      return config || $q.when(config);
    }

    return {
      responseError: responseError,
      request: request
    };

  });
