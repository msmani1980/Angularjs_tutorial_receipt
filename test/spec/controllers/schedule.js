'use strict';

describe('Controller: ScheduleCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ScheduleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduleCtrl = $controller('ScheduleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
