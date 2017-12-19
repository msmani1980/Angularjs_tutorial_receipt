'use strict';

describe('Service: surveyQuestionsService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var surveyQuestionsService;
  beforeEach(inject(function (_surveyQuestionsService_) {
    surveyQuestionsService = _surveyQuestionsService_;
  }));

  it('should do something', function () {
    expect(!!surveyQuestionsService).toBe(true);
  });

});
