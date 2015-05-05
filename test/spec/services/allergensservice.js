'use strict';

describe('Service: allergensService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var allergensService;
  beforeEach(inject(function (_allergensService_) {
    allergensService = _allergensService_;
  }));

  it('should do something', function () {
    expect(!!allergensService).toBe(true);
  }); 

});
