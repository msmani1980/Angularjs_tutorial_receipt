'use strict';

describe('Service: itemsFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var itemsFactory;
  beforeEach(inject(function (_itemsFactory_) {
    itemsFactory = _itemsFactory_;
  }));

  it('should exist', function () {
    expect(!!itemsFactory).toBe(true);
  });

});
