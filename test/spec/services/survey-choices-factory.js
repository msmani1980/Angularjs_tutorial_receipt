'use strict';

describe('Service: surveyChoicesFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var surveyChoicesFactory;
  beforeEach(inject(function (_surveyChoicesFactory_) {
    surveyChoicesFactory = _surveyChoicesFactory_;
  }));

  it('should do something', function () {
    expect(!!surveyChoicesFactory).toBe(true);
  });

});
