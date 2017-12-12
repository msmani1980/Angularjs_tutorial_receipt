'use strict';

describe('Service: surveyFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var surveyFactory;
  beforeEach(inject(function (_surveyFactory_) {
    surveyFactory = _surveyFactory_;
  }));

  it('should do something', function () {
    expect(!!surveyFactory).toBe(true);
  });

});
