'use strict';

describe('Service: manualEposPromotion', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var manualEposPromotion;
  beforeEach(inject(function (_manualEposPromotion_) {
    manualEposPromotion = _manualEposPromotion_;
  }));

  it('should do something', function () {
    expect(!!manualEposPromotion).toBe(true);
  });

});
