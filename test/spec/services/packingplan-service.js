'use strict';

describe('Service: packingplanService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var packingplanService;
  beforeEach(inject(function (_packingplanService_) {
    packingplanService = _packingplanService_;
  }));

  it('should do something', function () {
    expect(!!packingplanService).toBe(true);
  });

});
