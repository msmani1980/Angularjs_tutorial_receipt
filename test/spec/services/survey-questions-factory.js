'use strict';

describe('Service: surveyQuestionsFactory', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var surveyQuestionsFactory;
  beforeEach(inject(function (_surveyQuestionsFactory_) {
    surveyQuestionsFactory = _surveyQuestionsFactory_;
  }));

  it('should do something', function () {
    expect(!!surveyQuestionsFactory).toBe(true);
  });

});
