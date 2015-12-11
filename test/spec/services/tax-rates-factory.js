'use strict';

fdescribe('Service: taxRatesFactory', function() {

  beforeEach(module('ts5App'));

  var taxRatesFactory;
  var globalMenuService;
  var taxRateTypesService;
  var taxTypesService;
  var countriesService;
  var stationsService;
  var currenciesService;
  var taxRatesService;
  var companyId;

  beforeEach(inject(function(_taxRatesFactory_, $injector) {

    taxRatesFactory = _taxRatesFactory_;

    globalMenuService = $injector.get('GlobalMenuService');
    taxRateTypesService = $injector.get('taxRateTypesService');
    taxTypesService = $injector.get('taxTypesService');
    countriesService = $injector.get('countriesService');
    stationsService = $injector.get('stationsService');
    currenciesService = $injector.get('currenciesService');
    taxRatesService = $injector.get('taxRatesService');

    spyOn(taxRateTypesService, 'getTaxRateTypes');
    spyOn(taxTypesService, 'getTaxTypesList');
    spyOn(countriesService, 'getCountriesList');
    spyOn(stationsService, 'getStationList');
    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(taxRatesService, 'getCompanyTaxRatesList');

    companyId = globalMenuService.company.get();

  }));

  describe('getTaxRateTypes API call', function() {
    it('should call getTaxRateTypes', function() {
      taxRatesFactory.getTaxRateTypes(companyId);
      expect(taxRateTypesService.getTaxRateTypes).toHaveBeenCalledWith(companyId);
    });
  });

  describe('getTaxTypesList API call', function() {
    it('should call getTaxTypesList', function() {
      taxRatesFactory.getTaxTypesList(companyId);
      expect(taxTypesService.getTaxTypesList).toHaveBeenCalledWith({
        companyId
      });
    });
  });

  describe('getCountriesList API call', function() {
    it('should call getCountriesList', function() {
      taxRatesFactory.getCountriesList();
      expect(countriesService.getCountriesList).toHaveBeenCalledWith(companyId);
    });
  });

  describe('getStationsList API call', function() {
    it('should call getStationsList', function() {
      taxRatesFactory.getStationsList(companyId, 0);
      expect(stationsService.getStationList).toHaveBeenCalledWith(companyId, 0);
    });
  });

  describe('getCompanyCurrencies API call', function() {
    it('should call getCompanyCurrencies', function() {
      taxRatesFactory.getCompanyCurrencies(companyId);
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalledWith(companyId);
    });
  });

  describe('getCompanyTaxRatesList API call', function() {
    it('should call getCompanyTaxRatesList', function() {
      taxRatesFactory.getCompanyTaxRatesList(companyId);
      expect(taxRatesService.getCompanyTaxRatesList).toHaveBeenCalledWith(companyId);
    });
  });

});
