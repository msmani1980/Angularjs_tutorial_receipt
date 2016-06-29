'use strict';

describe('Controller: ScheduleReportCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ScheduleReportCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduleReportCtrl = $controller('ScheduleReportCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ScheduleReportCtrl.awesomeThings.length).toBe(3);
  });
});
