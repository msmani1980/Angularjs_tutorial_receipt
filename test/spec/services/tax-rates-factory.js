'use strict';

fdescribe('Service: taxRatesFactory', function() {

  beforeEach(module('ts5App'));

  var taxRatesFactory;
  var taxRateTypesService;
  var taxTypesService;
  var countriesService;
  var stationsService;
  var currenciesService;

  beforeEach(inject(function(_taxRatesFactory_, $injector) {
    taxRatesFactory = _taxRatesFactory_;

    taxRateTypesService = $injector.get('taxRateTypesService');
    taxTypesService = $injector.get('taxTypesService');
    countriesService = $injector.get('countriesService');
    stationsService = $injector.get('stationsService');
    currenciesService = $injector.get('currenciesService');

    spyOn(taxRateTypesService, 'getTaxRateTypes');
    spyOn(taxTypesService, 'getTaxTypesList');
    spyOn(countriesService, 'getCountriesList');
    spyOn(stationsService, 'getStationList');
    spyOn(currenciesService, 'getCompanyCurrencies');
  }));

  describe('getTaxRateTypes API call', function() {
    it('should call getTaxRateTypes', function() {
      var id = 432;
      taxRatesFactory.getTaxRateTypes(id);
      expect(taxRateTypesService.getTaxRateTypes).toHaveBeenCalledWith(id);
    });
  });

  describe('getTaxTypesList API call', function() {
    it('should call getTaxTypesList', function() {
      var id = 432;
      taxRatesFactory.getTaxTypesList(id);
      expect(taxTypesService.getTaxTypesList).toHaveBeenCalledWith(id);
    });
  });

  describe('getCountriesList API call', function() {
    it('should call getCountriesList', function() {
      taxRatesFactory.getCountriesList();
      expect(countriesService.getCountriesList).toHaveBeenCalled();
    });
  });

  describe('getStationsList API call', function() {
    it('should call getStationsList', function() {
      var id = 432;
      taxRatesFactory.getStationsList(id, 0);
      expect(stationsService.getStationList).toHaveBeenCalledWith(id, 0);
    });
  });

  describe('getCompanyCurrencies API call', function() {
    it('should call getCompanyCurrencies', function() {
      var id = 432;
      taxRatesFactory.getCompanyCurrencies(id);
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalledWith(id);
    });
  });

});
