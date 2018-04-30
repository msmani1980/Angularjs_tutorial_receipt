'use strict';

describe('Service: priceupdaterService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var priceupdaterService;
  beforeEach(inject(function (_priceupdaterService_) {
    priceupdaterService = _priceupdaterService_;
  }));

  it('should do something', function () {
    expect(!!priceupdaterService).toBe(true);
  });

});
