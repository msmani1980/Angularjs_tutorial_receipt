'use strict';

describe('Service: priceupdaterFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var priceupdaterFactory;
  beforeEach(inject(function (_priceupdaterFactory_) {
    priceupdaterFactory = _priceupdaterFactory_;
  }));

  it('should do something', function () {
    expect(!!priceupdaterFactory).toBe(true);
  });

});
