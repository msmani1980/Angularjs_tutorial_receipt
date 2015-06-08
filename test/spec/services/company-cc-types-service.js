'use strict';

describe('Service: companyCcTypesService', function () {

  beforeEach(module('ts5App'));

  var companyCcTypesService;
  beforeEach(inject(function (_companyCcTypesService_) {
    companyCcTypesService = _companyCcTypesService_;
  }));

  it('should do something', function () {
    expect(!!companyCcTypesService).toBe(true);
  });

});
