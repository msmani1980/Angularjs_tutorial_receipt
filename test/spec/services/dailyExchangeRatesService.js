'use strict';

describe('Service: dailyExchangeRatesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var dailyExchangeRatesService,
    $httpBackend,
    dailyExchangeRatesRequestHandler;
  beforeEach(inject(function (_dailyExchangeRatesService_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    dailyExchangeRatesRequestHandler = $httpBackend.whenGET(/api\/daily-exchange-rates/)
      .respond({
        'dailyExchangeRates': [{
          'id': 66,
          'exchangeRateDate': '2015-04-13',
          'chCompanyId': 362,
          'retailCompanyId': 326,
          'chBaseCurrencyId': 8,
          'retailBaseCurrencyId': 1,
          'isSubmitted': true,
          'createdBy': 1,
          'updatedBy': 1,
          'createdOn': '2015-04-13 15:00:10.675339',
          'updatedOn': '2015-04-13 15:00:22.625327',
          'dailyExchangeRateCurrencies': [{
            'id': 199,
            'dailyExchangeRateId': 66,
            'retailCompanyCurrencyId': 168,
            'bankExchangeRate': null,
            'coinExchangeRate': '1.0000',
            'paperExchangeRate': '1.0000'
          }]
        }], 'meta': {'count': 1, 'limit': 1, 'start': 0}
      });
    dailyExchangeRatesService = _dailyExchangeRatesService_;
  }));

  it('should do something', function () {
    expect(!!dailyExchangeRatesService).toBe(true);
  });

  describe('API calls', function () {

    afterEach(function () {
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch currencies list from services', function () {
      $httpBackend.expectGET(/api\/daily-exchange-rates/);
      dailyExchangeRatesService.getDailyExchangeRates().then(function (dailyExchangeRatesArray) {
        expect(dailyExchangeRatesArray[0].exchangeRateDate).toBe('2015-04-13');
      });

    });

  });
});
