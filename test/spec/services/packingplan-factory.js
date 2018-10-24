'use strict';

describe('Service: packingplanFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var packingplanFactory;
  beforeEach(inject(function (_packingplanFactory_) {
    packingplanFactory = _packingplanFactory_;
  }));

  it('should do something', function () {
    expect(!!packingplanFactory).toBe(true);
  });

});
