'use strict';

describe('Service: companiesService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var companiesService;
  beforeEach(inject(function (_companiesService_) {
    companiesService = _companiesService_;
  }));

  it('should do something', function () {
    expect(!!companiesService).toBe(true);
  });

});
