'use strict';

describe('Controller: SurveyChoicesCreateCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SurveyChoicesCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SurveyChoicesCreateCtrl = $controller('SurveyChoicesCreateCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SurveyChoicesCreateCtrl.awesomeThings.length).toBe(3);
  });
});
