'use strict';

describe('Service: employeeCommissionFactory', function () {

  beforeEach(module('ts5App'));

  var employeeCommissionFactory,
    itemsService,
    salesCategoriesService,
    priceTypesService,
    taxRateTypesService,
    currenciesService,
    employeeCommissionService;

  beforeEach(inject(function (_employeeCommissionFactory_, $injector) {
    itemsService = $injector.get('itemsService');
    salesCategoriesService = $injector.get('salesCategoriesService');
    priceTypesService = $injector.get('priceTypesService');
    taxRateTypesService = $injector.get('taxRateTypesService');
    currenciesService = $injector.get('currenciesService');
    employeeCommissionService = $injector.get('employeeCommissionService');

    spyOn(itemsService, 'getItemsList');
    spyOn(priceTypesService, 'getPriceTypesList');
    spyOn(taxRateTypesService, 'getTaxRateTypes');
    spyOn(currenciesService, 'getCompanyCurrencies');
    spyOn(employeeCommissionService, 'getCommissionList');
    spyOn(employeeCommissionService, 'getCommission');
    spyOn(employeeCommissionService, 'createCommission');
    spyOn(employeeCommissionService, 'updateCommission');
    spyOn(employeeCommissionService, 'deleteCommission');
    spyOn(salesCategoriesService, 'getSalesCategoriesList');

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

    it('should call salesCategoriesService.getSalesCategoriesList with a payload to get a categories list', function () {
      employeeCommissionFactory.getItemsCategoriesList(payload);
      expect(salesCategoriesService.getSalesCategoriesList).toHaveBeenCalled();
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

    it('should call getCommissionList() from commission service', function () {
      employeeCommissionFactory.getCommissionList();
      expect(employeeCommissionService.getCommissionList).toHaveBeenCalled();
    });

    it('should call getCommission() from commission service', function () {
      employeeCommissionFactory.getCommission();
      expect(employeeCommissionService.getCommission).toHaveBeenCalled();
    });

    it('should call createCommission() from commission service', function () {
      employeeCommissionFactory.createCommission();
      expect(employeeCommissionService.createCommission).toHaveBeenCalled();
    });

    it('should call updateCommission() from commission service', function () {
      employeeCommissionFactory.updateCommission();
      expect(employeeCommissionService.updateCommission).toHaveBeenCalled();
    });

    it('should call deleteCommission() from commission service', function () {
      employeeCommissionFactory.deleteCommission();
      expect(employeeCommissionService.deleteCommission).toHaveBeenCalled();
    });

  });

});
