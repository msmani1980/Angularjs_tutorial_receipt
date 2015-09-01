'use strict';

describe('Service: storeInstanceDispatchWizardConfig', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var storeInstanceDispatchWizardConfig;
  beforeEach(inject(function (_storeInstanceDispatchWizardConfig_) {
    storeInstanceDispatchWizardConfig = _storeInstanceDispatchWizardConfig_;
  }));

  it('should do something', function () {
    expect(!!storeInstanceDispatchWizardConfig).toBe(true);
  });

});
