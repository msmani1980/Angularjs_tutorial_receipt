'use strict';

describe('Service: templateOption', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var templateOption;
  beforeEach(inject(function (_templateOption_) {
    templateOption = _templateOption_;
  }));

  it('should do something', function () {
    expect(!!templateOption).toBe(true);
  });

});
