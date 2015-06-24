'use strict';

describe('Service: employeeCommissionFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var employeeCommissionFactory,
    itemsService,
    priceTypesService,
    taxRateTypesService;

  beforeEach(inject(function (_employeeCommissionFactory_, $injector) {
    itemsService = $injector.get('itemsService');
    priceTypesService = $injector.get('priceTypesService');
    taxRateTypesService = $injector.get('taxRateTypesService');

    spyOn(itemsService, 'getItemsList');
    spyOn(priceTypesService, 'getPriceTypesList');
    spyOn(taxRateTypesService, 'getTaxRateTypes');

    employeeCommissionFactory = _employeeCommissionFactory_;
  }));

  it('should exist', function () {
    expect(!!employeeCommissionFactory).toBe(true);
  });

  describe('API Calls', function () {

    it('should fetch items from itemsService', function () {
      employeeCommissionFactory.getItemsList();
      expect(itemsService.getItemsList).toHaveBeenCalled();
    });

    it('should fetch price types from priceTypesService', function () {
      employeeCommissionFactory.getPriceTypesList();
      expect(priceTypesService.getPriceTypesList).toHaveBeenCalled();
    });

    it('should fetch price types from priceTypesService', function () {
      employeeCommissionFactory.getTaxRateTypes();
      expect(taxRateTypesService.getTaxRateTypes).toHaveBeenCalled();
    });
  });

});
