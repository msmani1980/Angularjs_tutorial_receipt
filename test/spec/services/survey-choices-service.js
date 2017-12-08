'use strict';

describe('Service: surveyChoicesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var surveyChoicesService;
  beforeEach(inject(function (_surveyChoicesService_) {
    surveyChoicesService = _surveyChoicesService_;
  }));

  it('should do something', function () {
    expect(!!surveyChoicesService).toBe(true);
  });

});
