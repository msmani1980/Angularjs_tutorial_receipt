'use strict';

describe('Controller: SurveyQuestionsListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SurveyQuestionsListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SurveyQuestionsListCtrl = $controller('SurveyQuestionsListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SurveyQuestionsListCtrl.awesomeThings.length).toBe(3);
  });
});
