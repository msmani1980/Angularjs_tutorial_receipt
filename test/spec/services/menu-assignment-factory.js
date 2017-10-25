'use strict';

describe('Service: menuAssignmentFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuAssignmentFactory;
  beforeEach(inject(function (_menuAssignmentFactory_) {
    menuAssignmentFactory = _menuAssignmentFactory_;
  }));

  it('should do something', function () {
    expect(!!menuAssignmentFactory).toBe(true);
  });

});
