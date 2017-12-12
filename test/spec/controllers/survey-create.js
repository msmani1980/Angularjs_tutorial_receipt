'use strict';

describe('Controller: SurveyCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SurveyCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SurveyCreateCtrl = $controller('SurveyCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SurveyCreateCtrl.awesomeThings.length).toBe(3);
  });
});
