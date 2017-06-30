'use strict';

describe('Service: scheduleFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var scheduleFactory;
  beforeEach(inject(function (_scheduleFactory_) {
    scheduleFactory = _scheduleFactory_;
  }));

  it('should do something', function () {
    expect(!!scheduleFactory).toBe(true);
  });

});
