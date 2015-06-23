'use strict';

describe('Service: employeeCommissionFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var employeeCommissionFactory,
    itemsService,
    priceTypesService;

  beforeEach(inject(function (_employeeCommissionFactory_, _itemsService_, _priceTypesService_) {
    itemsService = _itemsService_;
    priceTypesService = _priceTypesService_;

    spyOn(itemsService, 'getItemsList');
    spyOn(priceTypesService, 'getPriceTypesList');

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
  });

});
