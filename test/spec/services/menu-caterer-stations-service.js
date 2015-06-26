'use strict';

describe('Service: menuCatererStationsService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var menuCatererStationsService;
  beforeEach(inject(function (_menuCatererStationsService_) {
    menuCatererStationsService = _menuCatererStationsService_;
  }));

  it('should do something', function () {
    expect(!!menuCatererStationsService).toBe(true);
  });

});
