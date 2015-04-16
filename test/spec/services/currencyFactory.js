'use strict';

describe('Factory: currencyFactory', function () {

  // load the service's module
  beforeEach(function () {
    module('ts5App');
    module(function ($provide) {
      $provide.value('currencies', {
        getCompanyBaseCurrency: function () {
          return {
            then: function (callback) {
              return callback({
                currencyCode: 'fakeCurrencyCode'
              });
            }
          };
        }
      });
      return null;
    });
  });

  // instantiate service
  var currencyFactory,
    currencies;
  beforeEach(inject(function (_currencyFactory_, _currencies_) {
    currencies = _currencies_;
    spyOn(currencies, 'getCompanyBaseCurrency').and.callThrough();
    currencyFactory = _currencyFactory_;
  }));

  it('should be defined', function () {
    expect(!!currencyFactory).toBe(true);
  });

  it('should call currencies getCompanyBaseCurrency', function () {
    currencyFactory.getCompanyBaseCurrency();
    expect(currencies.getCompanyBaseCurrency).toHaveBeenCalled();
  });

  it('should have some property', function () {
    currencyFactory.getCompanyBaseCurrency().then(function (companyCurrency) {
      expect(companyCurrency.currencyCode).toBe('fakeCurrencyCode');
    });

  });

});
