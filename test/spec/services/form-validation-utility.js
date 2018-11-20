'use strict';

describe('Service: formValidationUtility', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var formValidationUtility;
  beforeEach(inject(function (_formValidationUtility_) {
    formValidationUtility = _formValidationUtility_;
  }));

  it('should do something', function () {
    expect(!!formValidationUtility).toBe(true);
  });

});
