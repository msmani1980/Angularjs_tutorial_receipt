'use strict';

describe('Controller: ScheduledReportsCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ScheduledReportsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduledReportsCtrl = $controller('ScheduledReportsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ScheduledReportsCtrl.awesomeThings.length).toBe(3);
  });
});
