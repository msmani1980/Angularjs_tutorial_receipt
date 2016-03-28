'use strict';

describe('Service: manualEposFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var manualEposFactory;
  beforeEach(inject(function (_manualEposFactory_) {
    manualEposFactory = _manualEposFactory_;
  }));

  it('should do something', function () {
    expect(!!manualEposFactory).toBe(true);
  });

});
