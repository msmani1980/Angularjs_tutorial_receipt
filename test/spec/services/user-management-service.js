'use strict';

describe('Service: userManagementService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var userManagementService;
  beforeEach(inject(function (_userManagementService_) {
    userManagementService = _userManagementService_;
  }));

  it('should do something', function () {
    expect(!!userManagementService).toBe(true);
  });

});
