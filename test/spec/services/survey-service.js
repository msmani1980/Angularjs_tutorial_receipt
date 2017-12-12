'use strict';

describe('Service: surveyService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var surveyService;
  beforeEach(inject(function (_surveyService_) {
    surveyService = _surveyService_;
  }));

  it('should do something', function () {
    expect(!!surveyService).toBe(true);
  });

});
