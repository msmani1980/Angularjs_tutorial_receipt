'use strict';

describe('Service: dailyExchangeRatesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var dailyExchangeRatesService,
    $httpBackend,
    responseHandler,
    dailyExchangeJSON,
    previousExchangeJSON;
  beforeEach(inject(function (_dailyExchangeRatesService_, $injector) {
    dailyExchangeJSON = {
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
    };
    previousExchangeJSON = {
      "id": 66,
      "exchangeRateDate": "2015-04-13",
      "chCompanyId": 362,
      "retailCompanyId": 326,
      "chBaseCurrencyId": 8,
      "retailBaseCurrencyId": 1,
      "isSubmitted": true,
      "createdBy": 1,
      "updatedBy": 1,
      "createdOn": "2015-04-13 15:00:10.675339",
      "updatedOn": "2015-04-13 15:00:22.625327",
      "dailyExchangeRateCurrencies": [{
        "id": 199,
        "dailyExchangeRateId": 66,
        "retailCompanyCurrencyId": 168,
        "bankExchangeRate": null,
        "coinExchangeRate": "1.0000",
        "paperExchangeRate": "1.0000"
      }, {
        "id": 200,
        "dailyExchangeRateId": 66,
        "retailCompanyCurrencyId": 174,
        "bankExchangeRate": null,
        "coinExchangeRate": "1.8285",
        "paperExchangeRate": "1.6157"
      }, {
        "id": 201,
        "dailyExchangeRateId": 66,
        "retailCompanyCurrencyId": 175,
        "bankExchangeRate": null,
        "coinExchangeRate": "1.6777",
        "paperExchangeRate": "1.1136"
      }, {
        "id": 202,
        "dailyExchangeRateId": 66,
        "retailCompanyCurrencyId": 177,
        "bankExchangeRate": null,
        "coinExchangeRate": "1.0062",
        "paperExchangeRate": "1.7230"
      }, {
        "id": 203,
        "dailyExchangeRateId": 66,
        "retailCompanyCurrencyId": 179,
        "bankExchangeRate": null,
        "coinExchangeRate": "1.0000",
        "paperExchangeRate": "1.0000"
      }, {
        "id": 204,
        "dailyExchangeRateId": 66,
        "retailCompanyCurrencyId": 185,
        "bankExchangeRate": null,
        "coinExchangeRate": "1.1193",
        "paperExchangeRate": "1.1234"
      }]
    };

    dailyExchangeRatesService = _dailyExchangeRatesService_;

    $httpBackend = $injector.get('$httpBackend');
    responseHandler = $httpBackend.whenGET(/daily-exchange-rates/);

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

    it('should fetch the daily exchange rates array', function () {
      responseHandler.respond(dailyExchangeJSON);
      $httpBackend.expectGET(/api\/daily-exchange-rates/);
      dailyExchangeRatesService.getDailyExchangeRates('04132015').then(function (dailyExchangeRatesArray) {
        expect(dailyExchangeRatesArray[0].exchangeRateDate).toBe('2015-04-13');
      });
    });

    it('should fetch the previous exchange rates array', function () {
      responseHandler.respond(previousExchangeJSON);
      $httpBackend.expectGET(/previous-exchange-rate/);
      dailyExchangeRatesService.getPreviousExchangeRates().then(function (previousExchangeRatesArray) {
        expect(previousExchangeRatesArray.dailyExchangeRateCurrencies[0].coinExchangeRate).toBe('1.0000');
      });
    });

  });
});
