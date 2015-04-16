'use strict';

describe('Service: companyPreferences', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companyPreferences;
  beforeEach(inject(function (_companyPreferences_) {
    companyPreferences = _companyPreferences_;
  }));

  it('should do something', function () {
    expect(!!companyPreferences).toBe(true);
  });

});
