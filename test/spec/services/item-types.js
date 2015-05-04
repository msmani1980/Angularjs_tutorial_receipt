'use strict';

describe('Service: itemTypes', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var itemTypes;
  beforeEach(inject(function (_itemTypes_) {
    itemTypes = _itemTypes_;
  }));

  it('should do something', function () {
    expect(!!itemTypes).toBe(true);
  });

});
