'use strict';

describe('Service: userManagementFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var userManagementFactory;
  beforeEach(inject(function (_userManagementFactory_) {
    userManagementFactory = _userManagementFactory_;
  }));

  it('should do something', function () {
    expect(!!userManagementFactory).toBe(true);
  });

});
