'use strict';

describe('Service: employeeCommissionFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var employeeCommissionFactory,
    itemsService;

  beforeEach(inject(function (_employeeCommissionFactory_, _itemsService_) {
    itemsService = _itemsService_;
    spyOn(itemsService, 'getItemsList');
    employeeCommissionFactory = _employeeCommissionFactory_;
  }));

  it('should exist', function () {
    expect(!!employeeCommissionFactory).toBe(true);
  });

  describe('Items service API', function () {

    it('should fetch from API', function () {
      employeeCommissionFactory.getItemsList();
      expect(itemsService.getItemsList).toHaveBeenCalled();
    });
  });

});
