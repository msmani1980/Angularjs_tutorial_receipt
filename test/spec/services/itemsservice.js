'use strict';

describe('Service: itemsService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var itemsService;
  beforeEach(inject(function (_itemsService_) {
    itemsService = _itemsService_;
  }));

  it('should do something', function () {
    expect(!!itemsService).toBe(true);
  });

});
