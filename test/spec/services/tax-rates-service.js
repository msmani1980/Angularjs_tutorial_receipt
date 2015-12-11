'use strict';

describe('Service: taxRatesService', function() {

  beforeEach(module('ts5App', 'served/company-tax-rates.json'));

  var taxRatesService;
  var companyTaxRatesJSON;
  var $httpBackend;

  beforeEach(inject(function(_taxRatesService_, $injector) {
    taxRatesService = _taxRatesService_;
    inject(function(_servedCompanyTaxRates_) {
      companyTaxRatesJSON = _servedCompanyTaxRates_;
    });

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET(/tax-rates/).respond(companyTaxRatesJSON);
    taxRatesService = _taxRatesService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCompanyTaxRatesList', function() {
    var fakeReponseData;
    beforeEach(function() {
      taxRatesService.getCompanyTaxRatesList().then(function(dataFromAPI) {
        fakeReponseData = dataFromAPI;
      });
      $httpBackend.flush();
    });

    it('should be an Object', function() {
      expect(angular.isObject(fakeReponseData)).toBe(true);
    });

    it('should have a an array of taxRates', function() {
      expect(fakeReponseData.taxRates).toBeDefined();
    });

  });

});
