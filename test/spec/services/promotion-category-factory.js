'use strict';

describe('Service: promotionCategoryFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var promotionCategoryFactory;
  beforeEach(inject(function (_promotionCategoryFactory_) {
    promotionCategoryFactory = _promotionCategoryFactory_;
  }));

  it('should do something', function () {
    expect(!!promotionCategoryFactory).toBe(true);
  });

});
