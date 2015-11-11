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
  it('should have a getMenu function defined', function(){
    expect(mainMenuService.getMenu).toBeDefined();
    expect(Object.prototype.toString.call(mainMenuService.getMenu)).toBe('[object Function]');
  });
});
