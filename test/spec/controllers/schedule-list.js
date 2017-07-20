'use strict';

describe('Controller: ScheduleListCtrl', function () {

  // load the controller's module
  beforeEach(module('ts5App'));

  var ScheduleListCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ScheduleListCtrl = $controller('ScheduleListCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));


});
