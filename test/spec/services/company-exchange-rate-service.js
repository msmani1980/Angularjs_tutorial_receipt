'use strict';

describe('Service: companyExchangeRateService', function () {

  // load the service's module
  beforeEach(module('ts5App'));
  beforeEach(module('served/company-exchange-rates.json', 'served/company-exchange-rate.json'));

  // instantiate service
  var companyExchangeRateService,
    GlobalMenuService,
    $httpBackend,
    companyExchangeRateGetRequestHandler,
    companyExchangeRateDeleteRequestHandler,
    companyExchangeRatePostRequestHandler,
    companyExchangeRatePutRequestHandler,
    companyExchangeRatesJSON,
    companyExchangeRateJSON,
    createCompanyExchangeRateResult,
    updateCompanyExchangeRateResult;

  beforeEach(inject(function (_companyExchangeRateService_, $injector) {
    inject(function (_servedCompanyExchangeRates_, _servedCompanyExchangeRate_) {
      companyExchangeRatesJSON = _servedCompanyExchangeRates_;
      companyExchangeRateJSON = _servedCompanyExchangeRate_;
    });


    GlobalMenuService = $injector.get('GlobalMenuService');
    $httpBackend = $injector.get('$httpBackend');

    companyExchangeRateGetRequestHandler = $httpBackend.whenGET(/api\/companies\/403\/exchange-rates/).respond(companyExchangeRatesJSON);
    companyExchangeRateDeleteRequestHandler = $httpBackend.whenDELETE(/api\/companies\/403\/exchange-rates/).respond(companyExchangeRatesJSON);
    companyExchangeRatePostRequestHandler = $httpBackend.whenPOST(/api\/companies\/403\/exchange-rates/).respond(companyExchangeRatesJSON);
    companyExchangeRatePutRequestHandler = $httpBackend.whenPUT(/api\/companies\/403\/exchange-rates/).respond(companyExchangeRatesJSON);

    companyExchangeRateService = _companyExchangeRateService_;
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should do something', function () {
    expect(!!companyExchangeRateService).toBe(true);
  });

  describe('API calls', function () {
    afterEach(function () {
      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should fetch exchange rates from services', function () {
      $httpBackend.expectGET(/api\/companies\/403\/exchange-rates/);
      companyExchangeRateService.getCompanyExchangeRates({companyId:403}).then(function (companyExchangeRates) {
        expect(companyExchangeRates.response.length).toBeGreaterThan(0);
      });
    });

    it('should delete exchange rates by id', function () {
      $httpBackend.expectDELETE(/api\/companies\/403\/exchange-rates/);
      var payload = {
        companyId: 403,
        exchangeRateType: 1,
        id: 2
      };
      companyExchangeRateService.deleteCompanyExchangeRate(payload);
    });

    it('should create exchange rate', function () {
      $httpBackend.expectPOST(/api\/companies\/403\/exchange-rates/);
      companyExchangeRateService.createCompanyExchangeRate(companyExchangeRateJSON).then(function (dataFromAPI) {
        createCompanyExchangeRateResult = dataFromAPI;
      });
    });

    it('should update exchange rate', function () {
      $httpBackend.expectPUT(/api\/companies\/403\/exchange-rates/);
      companyExchangeRateService.updateCompanyExchangeRate(companyExchangeRateJSON).then(function (dataFromAPI) {
        updateCompanyExchangeRateResult = dataFromAPI;
      });
    });
  });
});
