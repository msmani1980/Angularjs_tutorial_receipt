'use strict';

describe('Service: currenciesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/currencies.json', 'served/company-currency-globals.json'));


  // instantiate service
  var currenciesService,
    $httpBackend,
    currenciesJSON,
    masterCurrenciesJSON,
    masterCurrenciesRequestHandler,
    companyCurrenciesRequestHandler;

  beforeEach(inject(function (_currenciesService_, $injector) {
    inject(function (_servedCurrencies_, _servedCompanyCurrencyGlobals_) {
      currenciesJSON = _servedCurrencies_;
      masterCurrenciesJSON = _servedCompanyCurrencyGlobals_;
    });

    $httpBackend = $injector.get('$httpBackend');
    masterCurrenciesRequestHandler = $httpBackend.whenGET(/api\/currencies/).respond(currenciesJSON);
    companyCurrenciesRequestHandler = $httpBackend.whenGET(/api\/company-currency-globals/).respond(masterCurrenciesJSON);

    currenciesService = _currenciesService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should exist', function () {
    expect(!!currenciesService).toBe(true);
  });

  describe('API calls', function () {

    afterEach(function () {
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch currencies list from services', function () {
      $httpBackend.expectGET(/currencies/);
      currenciesService.getCompanyGlobalCurrencies().then(function (companyCurrencies) {
        expect(companyCurrencies.response.length).toBeGreaterThan(0);
      });

    });

    it('should return USD as currencyCode', function () {
      currenciesService.getCompanyCurrencies().then(function (responseFromAPI) {
        expect(responseFromAPI.response[0].code).toBe('USD');
      });
    });

  });

});
