'use strict';

describe('Service: currencies', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var currencies,
    $httpBackend,
    currenciesRequestHandler;

  beforeEach(inject(function (_currencies_, $injector) {
    $httpBackend = $injector.get('$httpBackend');
    currenciesRequestHandler = $httpBackend.whenGET('https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies')
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
      $httpBackend.expectGET('https://ec2-52-6-49-188.compute-1.amazonaws.com/api/currencies');
      currencies.getCompanyBaseCurrency(1).then(function (companyCurrency) {
        expect(companyCurrency.currencyCode).toBe('USD');
      });

    });

    it('should return USD as currencyCode', function () {
      currencies.getCompanyBaseCurrency(1).then(function (companyCurrency) {
        expect(companyCurrency.currencyCode).toBe('USD');
      });
    });

  });

});
