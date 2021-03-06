'use strict';

describe('Service: currenciesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/currencies.json', 'served/currency.json', 'served/company-currency-globals.json'));
  beforeEach(module('served/company-data.json'));

  // instantiate service
  var currenciesService;
  var $httpBackend;
  var currenciesJSON;
  var currencyJSON;
  var masterCurrenciesJSON;
  var servedCompanyDataJSON;
  var masterCurrenciesRequestHandler;
  var companyCurrenciesRequestHandler;
  var detailedCurrenciesGetRequestHandler;
  var detailedCurrenciesDeleteRequestHandler;
  var detailedCurrenciesCreateRequestHandler;
  var detailedCurrenciesUpdateRequestHandler;
  var currencyDetailRequestHandler;
  var globalMenuService;

  beforeEach(inject(function (_currenciesService_, $injector) {
    inject(function (_servedCurrencies_, _servedCurrency_, _servedCompanyCurrencyGlobals_) {
      currenciesJSON = _servedCurrencies_;
      currencyJSON = _servedCurrency_;
      masterCurrenciesJSON = _servedCompanyCurrencyGlobals_;
    });

    servedCompanyDataJSON = $injector.get('servedCompanyData');
    globalMenuService = $injector.get('globalMenuService');
    spyOn(globalMenuService, 'getCompanyData').and.returnValue(servedCompanyDataJSON);

    $httpBackend = $injector.get('$httpBackend');
    masterCurrenciesRequestHandler = $httpBackend.whenGET(/api\/currencies/).respond(currenciesJSON);
    companyCurrenciesRequestHandler = $httpBackend.whenGET(/api\/company-currency-globals/).respond(masterCurrenciesJSON);
    detailedCurrenciesGetRequestHandler = $httpBackend.whenGET(/api\/companies\/403\/currencies/).respond(masterCurrenciesJSON);
    detailedCurrenciesDeleteRequestHandler = $httpBackend.whenDELETE(/api\/companies\/403\/currencies/).respond(202);
    detailedCurrenciesCreateRequestHandler = $httpBackend.whenPOST(/api\/companies\/403\/currencies/).respond(201, { id: 1 });
    detailedCurrenciesUpdateRequestHandler = $httpBackend.whenPUT(/api\/companies\/403\/currencies/).respond(201, currencyJSON);
    currencyDetailRequestHandler = $httpBackend.whenGET(/api\/currencies\/1/).respond(202, { id: 1 });

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

    var createDetailedCompanyCurrencyResult;
    var updateDetailedCompanyCurrencyResult;

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

    it('should fetch detailed currencies list', function () {
      $httpBackend.expectGET(/api\/companies\/403\/currencies/);
      currenciesService.getDetailedCompanyCurrencies().then(function (detailedCompanyCurrencies) {
        expect(detailedCompanyCurrencies.response.length).toBeGreaterThan(0);
      });
    });

    it('should delete detailed currency by currency id', function () {
      $httpBackend.expectDELETE(/api\/companies\/403\/currencies/);
      currenciesService.deleteDetailedCompanyCurrency(1);
    });

    it('should create detailed currency', function () {
      $httpBackend.expectPOST(/api\/companies\/403\/currencies/);
      currenciesService.createDetailedCompanyCurrency(currencyJSON).then(function (dataFromAPI) {
        createDetailedCompanyCurrencyResult = dataFromAPI;
      });
    });

    it('should update detailed currency', function () {
      $httpBackend.expectPUT(/api\/companies\/403\/currencies/);
      currenciesService.updateDetailedCompanyCurrency(currencyJSON).then(function (dataFromAPI) {
        updateDetailedCompanyCurrencyResult = dataFromAPI;
      });
    });

    it('should get currency detail', function () {
      var mockId = 1;
      $httpBackend.expectGET(/api\/currencies\/1/);
      currenciesService.getMasterCurrency(mockId).then(function (dataFromAPI) {
        expect(dataFromAPI).toBeDefined();
      });
    });

  });

});
