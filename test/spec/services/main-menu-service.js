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
  it('should have a getStockOwnerMenu function defined', function(){
    expect(mainMenuService.getStockOwnerMenu).toBeDefined();
    expect(Object.prototype.toString.call(mainMenuService.getStockOwnerMenu)).toBe('[object Function]');
  });
  it('should have a getRetailMenu function defined', function(){
    expect(mainMenuService.getRetailMenu).toBeDefined();
    expect(Object.prototype.toString.call(mainMenuService.getRetailMenu)).toBe('[object Function]');
  });
  it('should return the same array as getRetailMenu when no companyTypeId is passed to getMenu', function(){
    expect(mainMenuService.getMenu(1).length).toBe(mainMenuService.getRetailMenu().length);
  });
  it('should return the same array as getRetailMenu when 2 is passed to getMenu', function(){
    expect(mainMenuService.getMenu(2).length).toBe(mainMenuService.getStockOwnerMenu().length);
  });
  it('should return both array when call getAll', function(){
    var total = mainMenuService.getStockOwnerMenu().length + mainMenuService.getRetailMenu().length;
    expect(mainMenuService.getAll().length).toBe(total);
  });
});
