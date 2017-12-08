'use strict';

describe('Controller: SurveyChoicesListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var SurveyChoicesListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SurveyChoicesListCtrl = $controller('SurveyChoicesListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SurveyChoicesListCtrl.awesomeThings.length).toBe(3);
  });
});
