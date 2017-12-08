'use strict';

describe('Controller: SurveyQuestionsCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SurveyQuestionsCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SurveyQuestionsCreateCtrl = $controller('SurveyQuestionsCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SurveyQuestionsCreateCtrl.awesomeThings.length).toBe(3);
  });
});
