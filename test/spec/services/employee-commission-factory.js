'use strict';

describe('Service: employeeCommissionFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var employeeCommissionFactory,
    itemsService,
    priceTypesService,
    taxRateTypesService,
    currenciesService;

  beforeEach(inject(function (_employeeCommissionFactory_, $injector) {
    itemsService = $injector.get('itemsService');
    priceTypesService = $injector.get('priceTypesService');
    taxRateTypesService = $injector.get('taxRateTypesService');
    currenciesService = $injector.get('currenciesService');

    spyOn(itemsService, 'getItemsList');
    spyOn(priceTypesService, 'getPriceTypesList');
    spyOn(taxRateTypesService, 'getTaxRateTypes');
    spyOn(currenciesService, 'getCompanyCurrencies');

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

    it('should fetch tax rate types from taxRateTypesService', function () {
      employeeCommissionFactory.getTaxRateTypes();
      expect(taxRateTypesService.getTaxRateTypes).toHaveBeenCalled();
    });

    it('should fetch the currency from currency service', function () {
      employeeCommissionFactory.getCompanyCurrencies();
      expect(currenciesService.getCompanyCurrencies).toHaveBeenCalled();
    });
  });

});
