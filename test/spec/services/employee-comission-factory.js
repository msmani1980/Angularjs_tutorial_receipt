'use strict';

describe('Service: employeeComissionFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var employeeComissionFactory;
  beforeEach(inject(function (_employeeComissionFactory_) {
    employeeComissionFactory = _employeeComissionFactory_;
  }));

  it('should do something', function () {
    expect(!!employeeComissionFactory).toBe(true);
  });

});
