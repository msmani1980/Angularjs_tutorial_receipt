'use strict';

fdescribe('Service: menuAssignmentService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuAssignmentService;
  beforeEach(inject(function (_menuAssignmentService_) {
    menuAssignmentService = _menuAssignmentService_;
  }));

  it('should do something', function () {
    expect(!!menuAssignmentService).toBe(true);
  });

});
