'use strict';

describe('Service: currencies', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/menus.json'));


  // instantiate service
  var currencies,
    $httpBackend,
    globalCurrenciesRequestHandler,
    companyCurrenciesRequestHandler;

  beforeEach(inject(function (_currencies_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    globalCurrenciesRequestHandler = $httpBackend.whenGET(/api\/currencies/)
      .respond({
        'response': [{
          createdOn: '2014-08-19',
          currencyCode: 'USD',
          currencyId: 1,
          currencyName: 'U.S. Dollar',
          currencySymbol: '$',
          decimalPrecision: 2,
          id: 1
        }]
      });

    companyCurrenciesRequestHandler = $httpBackend.whenGET(/api\/companies\/(\d*)\/currencies/)
      .respond({
        'companyCurrencies': [{
          'id': 168,
          'companyId': 326,
          'currencyCode': 'GBP',
          'currencyId': 8,
          'currencyName': 'British Pound',
          'currencySymbol': '£',
          'startDate': '2015-01-10',
          'endDate': '2050-01-01',
          'eposDisplayOrder': 1,
          'isOperatedCurrency': true,
          'countries': [{'id': 4, 'countryId': 84, 'currencyId': 8}],
          'denominations': [{
            'id': 49,
            'companyCurrencyId': 168,
            'currencyDenominationId': 67,
            'isEasyPay': null
          }, {'id': 50, 'companyCurrencyId': 168, 'currencyDenominationId': 68, 'isEasyPay': null}, {
            'id': 51,
            'companyCurrencyId': 168,
            'currencyDenominationId': 69,
            'isEasyPay': null
          }, {'id': 52, 'companyCurrencyId': 168, 'currencyDenominationId': 70, 'isEasyPay': null}, {
            'id': 53,
            'companyCurrencyId': 168,
            'currencyDenominationId': 71,
            'isEasyPay': null
          }, {'id': 54, 'companyCurrencyId': 168, 'currencyDenominationId': 72, 'isEasyPay': null}, {
            'id': 55,
            'companyCurrencyId': 168,
            'currencyDenominationId': 7,
            'isEasyPay': null
          }, {'id': 56, 'companyCurrencyId': 168, 'currencyDenominationId': 9, 'isEasyPay': null}, {
            'id': 57,
            'companyCurrencyId': 168,
            'currencyDenominationId': 10,
            'isEasyPay': null
          }, {'id': 58, 'companyCurrencyId': 168, 'currencyDenominationId': 11, 'isEasyPay': null}]
        }], 'meta': {'count': 6, 'limit': 6, 'start': 0}
      });
    currencies = _currencies_;
  }));


  it('should exist', function () {
    expect(!!currencies).toBe(true);
  });

  describe('API calls', function () {

    afterEach(function () {
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch currencies list from services', function () {
      $httpBackend.expectGET(/currencies/);
      currencies.getCompanyBaseCurrency(1).then(function (companyCurrency) {
        expect(companyCurrency.currencyCode).toBe('USD');
      });

    });

    it('should return USD as the company base currencyCode', function () {
      currencies.getCompanyBaseCurrency(1).then(function (companyBaseCurrency) {
        expect(companyBaseCurrency.currencyCode).toBe('USD');
      });
    });

    it('should return USD as currencyCode', function () {
      currencies.getCompanyCurrencies().then(function (currenciesArray) {
        expect(currenciesArray.companyCurrencies[0].currencyCode).toBe('GBP');
      });
    });

  });

});
