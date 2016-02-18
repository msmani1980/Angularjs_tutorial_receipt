'use strict';

describe('Service: mainMenuService', function () {

  // load the service's module
  beforeEach(module('ts5App'));

  // instantiate service
  var mainMenuService;
  beforeEach(inject(function (_mainMenuService_) {
    mainMenuService = _mainMenuService_;
  }));

  it('should do something', function () {
    expect(!!mainMenuService).toBe(true);
  });

  it('should have a get retail menu function defined', function() {
    expect(mainMenuService.Retail).toBeDefined();
  });

  it('should have a get cash handler function defined', function() {
    expect(mainMenuService['Cash Handler']).toBeDefined();
  });

  it('should have a get stockowner handler function defined', function() {
    expect(mainMenuService.Stockowner).toBeDefined();
  });
});
