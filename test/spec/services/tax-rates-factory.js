'use strict';

describe('Service: taxRatesFactory', function() {

  beforeEach(module('ts5App'));

  var taxRatesFactory;
  var taxRateTypesService;
  var taxTypesService;

  beforeEach(inject(function(_taxRatesFactory_, $injector) {
    taxRatesFactory = _taxRatesFactory_;

    taxRateTypesService = $injector.get('taxRateTypesService');
    taxTypesService = $injector.get('taxTypesService');

    spyOn(taxRateTypesService, 'getTaxRateTypes');
    spyOn(taxTypesService, 'getTaxTypesList');
  }));

  describe('getTaxRateTypes API call', function() {
    it('should call getTaxRateTypes', function() {
      var id = 432;
      taxRateTypesService.getTaxRateTypes(id);
      expect(taxRateTypesService.getTaxRateTypes).toHaveBeenCalledWith(id);
    });
  });

  describe('getTaxTypesList API call', function() {
    it('should call getTaxTypesList', function() {
      var id = 432;
      taxTypesService.getTaxTypesList(id);
      expect(taxTypesService.getTaxTypesList).toHaveBeenCalledWith(id);
    });
  });

});
