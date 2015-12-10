'use strict';

describe('Service: taxRatesFactory', function() {

  beforeEach(module('ts5App'));

  var taxRatesFactory;
  var taxRateTypesService;
  var taxTypesService;
  var countriesService;

  beforeEach(inject(function(_taxRatesFactory_, $injector) {
    taxRatesFactory = _taxRatesFactory_;

    taxRateTypesService = $injector.get('taxRateTypesService');
    taxTypesService = $injector.get('taxTypesService');
    countriesService = $injector.get('countriesService');

    spyOn(taxRateTypesService, 'getTaxRateTypes');
    spyOn(taxTypesService, 'getTaxTypesList');
    spyOn(countriesService, 'getCountriesList');
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

});
