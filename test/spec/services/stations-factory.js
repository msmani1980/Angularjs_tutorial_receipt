'use strict';

describe('Service: stationsFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var stationsFactory;
  beforeEach(inject(function (_stationsFactory_) {
    stationsFactory = _stationsFactory_;
  }));

  it('should do something', function () {
    expect(!!stationsFactory).toBe(true);
  });

});
