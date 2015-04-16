'use strict';

/**
 * @ngdoc service
 * @name ts5App.currencyFactory
 * @description
 * # currencyFactory
 * Factory in the ts5App.
 */
angular.module('ts5App')
  .factory('currencyFactory', function ($q, $resource, currencies) {
    var getCompany = function (companyId) {
      return {
        'id': companyId,
        'companyName': 'Virgin Australia',
        'legalName': 'Virgin Australia',
        'baseCurrencyId': 1,
        'exchangeRateVariance': '10.0000'
      };
    };

    var getCompanyBaseCurrency = function(){
      var baseCurrencyId = getCompany(326).baseCurrencyId;
      return currencies.getCompanyBaseCurrency(baseCurrencyId);
    };

    return {
      getCompanyBaseCurrency: getCompanyBaseCurrency,
      getCompanyCurrencies: currencies.getCompanyCurrencies
    };

  });
