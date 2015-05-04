'use strict';

describe('Service: itemTypesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var itemTypesService;
  beforeEach(inject(function (_itemTypesService_) {
    itemTypesService = _itemTypesService_;
  }));

  it('should do something', function () {
    expect(!!itemTypesService).toBe(true); 
  });

});
